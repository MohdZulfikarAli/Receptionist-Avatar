
import {StatusBar,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  PermissionsAndroid
  } from 'react-native';
import React,{useEffect, useState} from 'react';
import {Video,ResizeMode} from 'expo-av';
import Voice from '@react-native-voice/voice';



export default function App()
{
  const videoRef = React.useRef(null);
  const [state, setState] = React.useState({ property: null });
  const[result,setResult] = useState([]);
  const[permission,setPermission] = useState(false);
  const [videoSource, setVideoSource] = useState(require('./assets/help.mp4'));

  useEffect(()  => {
    Voice.onSpeechStart = onSpeechStarted;
    Voice.onSpeechEnd = onSpeechEnded;
    Voice.onSpeechResults = onSpeechResult;
    initializeVoice();
    return() =>
    {
      Voice.destroy().then(Voice.removeAllListeners)
    }
   
  }, []);

  initializeVoice = async ()=>
  {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'App needs access to your microphone for voice recognition.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      setPermission(true)
    }
    else{
      setPermission(false);
    }
  }

  const onSpeechStarted = (e)=>{

  }

  const onSpeechEnded = (e) =>{

  }

  const onSpeechResult = (e)=>{
    console.log(e)
    stopRecognizing();
     setResult(e.value);
     setVideoSourceForText(e.value)
  }

  useEffect(() => {
    // Play the video when the component mounts or when the source changes
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, [videoSource]);

  
  const startRecognizing = async () =>
  {
    try {
        if(permission == true)
        {
          await Voice.start('en-US');
          setResult([]);
        }
    } 
    catch (error) {
      console.warn(error);
  }
}

  const stopRecognizing = async () =>
  {
    try {
      await Voice.stop();
      await Voice.destroy();
      setResult([])
    } 
    catch (error) {
      console.log(error)
    }
  }

  const setVideoSourceForText = (text) => {
    if (text.includes('who are you')) {
      setVideoSource(require('./assets/receptionist.mp4'));
    } else if (text.includes('can i meet with harry')) {
      setVideoSource(require('./assets/harry.mp4'));
    } else {
      setVideoSource(require('./assets/understood.mp4'));
    }
  };


  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
    <View style={styles.container}>
      <Video
        ref={videoRef}
        style={{position:'absolute',
        left : 0,
        right : 0,
        top :0 ,
        bottom: 0,
        backgroundColor:'rgb(221,219,225)',
        }}
        source={videoSource}
        shouldPlay
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            startRecognizing();
          }
        }}
      />
    </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  video:
  {
    position:'absolute',
    left : 0,
    right : 0,
    top :0 ,
    bottom: 0
  }
});