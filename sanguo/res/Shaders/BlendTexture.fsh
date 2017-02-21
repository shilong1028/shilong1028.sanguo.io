
#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

uniform sampler2D u_texture1;
uniform float u_interpolate;

uniform vec4 color2;

vec3 ContrastSaturationBrightness(vec3 color,float brt,float sat,float con)
{
	float AvgLumR = 0.5;
	float AvgLumG =0.5;
	float AvgLumB = 0.5;
	vec3 LuminanceCoeff = vec3(0.2125,0.7154,0.0721);
	vec3 AvgLumin = vec3(AvgLumR,AvgLumG,AvgLumB);
	vec3 brtColor = color * brt;
	float intensityf = dot(brtColor,LuminanceCoeff);
	vec3 intensity = vec3(intensityf,intensityf,intensityf);

	vec3 satColor = mix(intensity,brtColor,sat);

	vec3 conColor = mix(AvgLumin,satColor,con);
	return conColor;
}

void main() {
    vec4 color1 = texture2D(CC_Texture0, v_texCoord);
	//0
	//gl_FragColor = color1;
	//1
    //gl_FragColor = v_fragmentColor * mix( color1, color2, color2.w);
	//2
	//gl_FragColor = color1 * color2;
	//gl_FragColor.w = color1.w;
	//3
	//float x = (color1.x*color1.w + color2.x*color2.w)/2;
	//float y = (color1.y*color1.w + color2.y*color2.w)/2;
	//float z = (color1.z*color1.w + color2.z*color2.w)/2;
	//gl_FragColor = vec4(x,y,z,color1.w);
	//4
	/*
	float a = color2.w;
	float x =  0;
	float y =  1;
	float z =  0;
	gl_FragColor = vec4(x,y,z,color1.w); //color1.w*color2.w
	*/
	//5
	
	float a = color2.w;
	float r =  color1.x*color2.x;
	float g =  color1.y*color2.x;
	float b =  color1.z*color2.x;
	gl_FragColor = vec4(r,g,b,color1.w); //color1.w
	
	//6
	//gl_FragColor = vec4(1,0,0,0.0);
	//gl_FragColor = v_fragmentColor *vec4(mix(color1.rgb , color2.rgb,color2.a),color1.a);
	//gl_FragColor = vec4(mix(color1.rgb , color2.rgb,color2.a),color1.a);
	vec3 c2 = color2.rgb*color2.a;
	gl_FragColor = vec4(color1.rgb*c2 ,color1.a);
}

