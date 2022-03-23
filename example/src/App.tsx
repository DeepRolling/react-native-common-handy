import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { useApplicationStateChangeAbility } from 'react-native-common-handy';

export default function App() {
  useApplicationStateChangeAbility();
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
