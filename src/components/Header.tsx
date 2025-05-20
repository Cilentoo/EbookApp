import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: () => void;
  rightIcon?: string;
  rightText?: string;
  leftAction?: () => void;
  leftIcon? : string; 
  leftText?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBack,
  rightAction,
  rightIcon,
  rightText,
  leftAction,
  leftIcon, 
  leftText
}) => {
  const { user } = useAuth();
  
  return (
    <View style={styles.container}>
      <StatusBar 
        backgroundColor="#4CAF50" 
        barStyle="light-content" 
      />
      
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      
      <View style={styles.rightContainer}>
        {rightAction && (rightIcon || rightText) && (
          <TouchableOpacity 
            style={styles.rightButton} 
            onPress={rightAction}
          >
            {rightIcon && (
              <Ionicons name={rightIcon as any} size={22} color="#fff" />
            )}
            
            {rightText && (
              <Text style={styles.rightButtonText}>{rightText}</Text>
            )}
          </TouchableOpacity>
        )}
        
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.displaysName}</Text>
            <View style={[
              styles.roleTag,
              user.role === 'AUTHOR' ? styles.authorTag : styles.readerTag
            ]}>
              <Text style={styles.roleText}>
                {user.role === 'AUTHOR' ? 'Autor' : 'Leitor'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight || 0,
    paddingBottom: 10,
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    padding: 5,
  },
  rightButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 14,
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  authorTag: {
    backgroundColor: '#388E3C',
  },
  readerTag: {
    backgroundColor: '#5E35B1',
  },
  roleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;