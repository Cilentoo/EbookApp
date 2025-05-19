import AsyncStorage from '@react-native-async-storage/async-storage';

const ANALYTICS_KEY = '@LoveBooks:analytics';

interface AnalyticsData {
  booksCreated: number;
  booksRead: number;
  chaptersCreated: number;
  commentsCreated: number;
  lastUsed: number;
  totalSessions: number;
}

export const incrementAnalytics = async (key: keyof AnalyticsData) => {
  try {
    const data = await getAnalytics();
    data[key]++;
    await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
};

export const getAnalytics = async (): Promise<AnalyticsData> => {
  try {
    const data = await AsyncStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : createInitialAnalytics();
  } catch (error) {
    console.error('Error getting analytics:', error);
    return createInitialAnalytics();
  }
};

const createInitialAnalytics = (): AnalyticsData => ({
  booksCreated: 0,
  booksRead: 0,
  chaptersCreated: 0,
  commentsCreated: 0,
  lastUsed: Date.now(),
  totalSessions: 0
});
