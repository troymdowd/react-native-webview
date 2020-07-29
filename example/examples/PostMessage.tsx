import React, {Component, useState} from 'react';
import {Text, View, ScrollView, Alert} from 'react-native';

import WebView from 'react-native-webview';

const HTML = `
<!DOCTYPE html>
<html>
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Post Message test</title>
  </head>
  <body>
    <div>
        <p>The page height will be calculated via document.body.clientHeight, and sent back to the WebView control.</p>
        <p>If it works you wil see the document element size calculated. </p>
        <p>If it fails, it will tell you it 'Didnt work'.</p>
    </div>
  </body>
</html>
`;


const PostMessage = () => {
    const [msgText, setMsgText] = useState('Didnt work.');

    return (
      <ScrollView>
        <View style={{ }}>
          <View style={{ height: 400 }}>
            <WebView
              /**
               * This HTML is a copy of the hosted multi-frame JS injection test.
               * I have found that Android doesn't support beforeContentLoaded for a hosted HTML webpage, yet does for a static source.
               * The cause of this is unresolved.
               */
              source={{ html: HTML }}
              automaticallyAdjustContentInsets={false}
              style={{backgroundColor:'#00000000'}}
              
              /* Must be populated in order for `messagingEnabled` to be `true` to activate the
               * JS injection user scripts, consistent with current behaviour. This is undesirable,
               * so needs addressing in a follow-up PR. */
              onMessage={event => {
                  setMsgText(event.nativeEvent.data);
              }}

              injectedJavaScript={`
                
                setTimeout(function() { 
                    window.ReactNativeWebView.postMessage(document.body.clientHeight || document.documentElement.clientHeight || window.innerHeight);
                }, 100);
                true; // note: this is required, or you'll sometimes get silent failures
              `}
            />
          </View>
        </View>
        <Text>The document element size is: {msgText}</Text>
      </ScrollView>
    );
}

export default PostMessage;
