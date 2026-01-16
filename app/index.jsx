import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const TOTAL_TIME = 25 * 60;
const ICON_SIZE = 72;

export default function Index() {
  const [isLoading, setIsLoading] = useState(true); // 👈 loading state
  const [time, setTime] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState(null);

  // 🔹 Show loading for 2 seconds on app open
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // ⏱ Background-safe timer logic
  useEffect(() => {
    if (!isRunning || !endTime) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        Math.floor((endTime - Date.now()) / 1000),
        0
      );

      setTime(remaining);

      if (remaining === 0) {
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, endTime]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setEndTime(Date.now() + time * 1000);
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(TOTAL_TIME);
    setEndTime(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 🔄 LOADING SCREEN
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="red" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // ⏱ MAIN TIMER SCREEN
  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(time)}</Text>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleTimer}>
          <Ionicons
            name={isRunning ? 'pause-circle' : 'play-circle'}
            size={ICON_SIZE}
            color={isRunning ? 'orange' : 'green'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={resetTimer}>
          <Ionicons name="refresh-circle" size={ICON_SIZE} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 15,
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    color: 'white',
    fontSize: 90,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  controls: {
    flexDirection: 'row',
    gap: 30,
  },
  iconBtn: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
