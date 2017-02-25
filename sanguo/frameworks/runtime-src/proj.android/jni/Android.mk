LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

APP_PLATFORM := android-20
LOCAL_MODULE := cocos2dlua_shared

LOCAL_MODULE_FILENAME := libcocos2dlua

LOCAL_SRC_FILES := \
../../Classes/AppDelegate.cpp \
../../Classes/ark_File.cpp \
../../Classes/ark_Stream.cpp \
../../Classes/ark_Utility.cpp \
../../Classes/ImodAnim.cpp \
../../Classes/lua_ark_Stream_auto.cpp \
../../Classes/lua_ImodAnim_auto.cpp \
hellolua/main.cpp

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes

# _COCOS_HEADER_ANDROID_BEGIN
# _COCOS_HEADER_ANDROID_END

LOCAL_STATIC_LIBRARIES := cocos2d_lua_static
LOCAL_WHOLE_STATIC_LIBRARIES += libiconv

# _COCOS_LIB_ANDROID_BEGIN
# _COCOS_LIB_ANDROID_END

include $(BUILD_SHARED_LIBRARY)

$(call import-module,scripting/lua-bindings/proj.android)
$(call import-module,iconv)

# _COCOS_LIB_IMPORT_ANDROID_BEGIN
# _COCOS_LIB_IMPORT_ANDROID_END
