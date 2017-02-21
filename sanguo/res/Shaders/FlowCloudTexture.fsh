#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
uniform float u_interpolate;

void main(void)
{
	float nx = mod(v_texCoord.x + u_interpolate,1.0);
	vec4 color1 = texture2D(CC_Texture0, vec2(nx,v_texCoord.y));
	gl_FragColor = color1;
}