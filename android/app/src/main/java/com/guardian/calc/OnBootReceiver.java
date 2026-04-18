package com.guardian.calc;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class OnBootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            // Restart the service after phone reboot
            Intent serviceIntent = new Intent(context, RecordingService.class);
            serviceIntent.putExtra("restarted_on_boot", true);
            context.startForegroundService(serviceIntent);
        }
    }
}
