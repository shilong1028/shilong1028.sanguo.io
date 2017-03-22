package org.cocos2dx.lua;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lua.AppActivity;

import com.YingChuan.SanGuo.R;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.KeyEvent;
import android.view.View;

public class SplashScreen extends Activity{
	
public static SplashScreen instance = null;
	
	protected void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		
		View splash = this.getLayoutInflater().inflate(R.layout.splash, null, false);
		setContentView(splash);

		instance = this;
		new Handler().postDelayed(new Runnable(){
			@Override
			public void run(){
				
				View splash = SplashScreen.this.getLayoutInflater().inflate(R.layout.splash2, null, false);
				setContentView(splash);	
				
				new Handler().postDelayed(new Runnable(){
					@Override
					public void run(){
						Intent intent = new Intent(SplashScreen.this,AppActivity.class); 
						SplashScreen.this.startActivity(intent);
					}
					private void startActivity(Intent intent) {
						// TODO Auto-generated method stub	
						}
				}, 500);
			}
		}, 2000);
	}
	
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		 if(keyCode == KeyEvent.KEYCODE_BACK) { //���η��ؼ� 
			 return false; 
		 }
		 return super.onKeyDown(keyCode, event); 
	}
}
