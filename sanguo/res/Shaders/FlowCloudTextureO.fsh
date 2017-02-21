
#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

uniform sampler2D u_texture1;
uniform float u_interpolate = 0;

uniform vec4 color2;


void main() {
	//float nx = mod(v_texCoord.x + u_interpolate,1);
    vec4 color1 = texture2D(CC_Texture0, vec2(0.5,v_texCoord.y));
	gl_FragColor = color1;
}

