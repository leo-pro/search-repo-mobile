import React from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { ActivityIndicator, StyleSheet } from 'react-native';

// import { Container } from './styles';
const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
});

export default function StarredRepo({ route }) {
  const { starredRepo } = route.params;
  return (
    <>
      <WebView
        source={{ uri: starredRepo.html_url }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            color="black"
            size="large"
            style={styles.flexContainer}
          />
        )}
      />
    </>
  );
}

StarredRepo.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
};
