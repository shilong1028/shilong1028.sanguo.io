/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2016 cocos2d-x.org
Copyright (c) 2013-2016 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.lua;

import java.util.ArrayList;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Handler;


public class AppActivity extends Cocos2dxActivity{  
	
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // Tests should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        
        return glSurfaceView;
    }
    
	protected void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);

//		new Handler().postDelayed(new Runnable() {
//			@Override
//			public void run() {
//				if(SplashScreen.instance != null){
//					SplashScreen.instance.finish();
//				}					
//			}
//		}, 2000); 
	}

    protected void onPause() {
        super.onPause();
    }
    
	protected void onStop() 
	{ 	
		super.onStop();
	}
	
	protected void onResume() 
	{ 		
		super.onResume();
	}
	
	protected void onDestroy() 
	{ 	
		super.onDestroy();
	}
    
	//判断网络是否连接的接口，供lua调用
    private boolean isNetworkConnected() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);  
        if (cm != null) {  
            NetworkInfo networkInfo = cm.getActiveNetworkInfo();  
        ArrayList networkTypes = new ArrayList();
        networkTypes.add(ConnectivityManager.TYPE_WIFI);
        try {
            networkTypes.add(ConnectivityManager.class.getDeclaredField("TYPE_ETHERNET").getInt(null));
        } catch (NoSuchFieldException nsfe) {
        }
        catch (IllegalAccessException iae) {
            throw new RuntimeException(iae);
        }
        if (networkInfo != null && networkTypes.contains(networkInfo.getType())) {
                return true;  
            }  
        }  
        return false;  
    } 
}
