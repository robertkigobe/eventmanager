import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,Platform
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const webViewRef = useRef(null);

  // Function to handle returning to the homepage
  const returnToHomepage = () => {
    navigation.navigate('Home');
  };

  // Handle WebView loading events
  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // JavaScript to be injected into the webpage to make it responsive
  const INJECTED_JAVASCRIPT = `
    (function() {
      // Remove any existing viewport meta tags
      const existingMetas = document.querySelectorAll('meta[name="viewport"]');
      existingMetas.forEach(meta => meta.remove());
      
      // Add our custom viewport meta tag
      const meta = document.createElement('meta');
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
      meta.setAttribute('name', 'viewport');
      document.getElementsByTagName('head')[0].appendChild(meta);
      
      // Add more comprehensive CSS to ensure proper fitting
      const style = document.createElement('style');
      style.textContent = \`
        body {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
        }
        img, table, div, form, input, select, textarea {
          max-width: 100% !important;
          height: auto !important;
          box-sizing: border-box !important;
        }
        iframe {
          max-width: 100% !important;
        }
        /* Force single column layout on mobile */
        @media (max-width: 768px) {
          .row, .column, .col, [class*="col-"] {
            width: 100% !important;
            display: block !important;
            float: none !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 10px !important;
            padding-right: 10px !important;
            box-sizing: border-box !important;
          }
        }
      \`;
      document.getElementsByTagName('head')[0].appendChild(style);
      
      // Force redraw after a slight delay to ensure styles are applied
      setTimeout(function() {
        window.scrollTo(0, 0);
        document.body.style.display = 'none';
        setTimeout(function() { 
          document.body.style.display = 'block';
          // Notify the app that the content is ready
          window.ReactNativeWebView.postMessage('Content adjusted');
        }, 100);
      }, 300);
      
      true;
    })();
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primaryBlue} barStyle="light-content" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={returnToHomepage}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BBNAC Registration</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* WebView to display the registration page */}
      <View style={styles.webViewContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryBlue} />
            <Text style={styles.loadingText}>Loading registration page...</Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color={colors.errorColor} />
            <Text style={styles.errorText}>
              Unable to load the registration page. Please check your internet connection.
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setError(false);
                setLoading(true);
                // Force WebView to reload
                webViewRef.current?.reload();
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://www.bbnac.org/registration' }}
          style={styles.webView}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          startInLoadingState={true}
          renderLoading={() => null} // We're handling loading state ourselves
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={Platform.OS === 'android'} // Only needed for Android
          automaticallyAdjustContentInsets={false}
          contentInset={{ top: 0, left: 0, bottom: 0, right: 0 }}
          scrollEnabled={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          originWhitelist={['*']}
          userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
          cacheEnabled={false}
          incognito={true} // Use incognito mode to avoid caching issues
          onMessage={(event) => {
            console.log('Message from WebView:', event.nativeEvent.data);
            // If needed, you can handle messages from the WebView here
          }}
          onNavigationStateChange={(navState) => {
            // You can track navigation changes here if needed
            console.log('Navigation state changed:', navState.url);
          }}
        />
      </View>
      
      {/* Bottom navigation button to return home */}
      <TouchableOpacity 
        style={styles.homeButton}
        onPress={returnToHomepage}
      >
        <Ionicons name="home-outline" size={20} color={colors.white} />
        <Text style={styles.homeButtonText}>Return to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  placeholder: {
    width: 40, // To balance the header layout
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  webView: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    zIndex: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textDark,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    zIndex: 10,
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primaryBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: colors.secondaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 0,
  },
  homeButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
