import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Import all images from assets/publicity
// Note: You'll need to replace these with your actual image imports
const slideshowImages = [
  require('../../assets/publicity/p1.jpeg'),
  require('../../assets/publicity/p2.jpeg'),
  require('../../assets/publicity/p3.jpeg'),
  require('../../assets/publicity/p4.jpeg'),
  require('../../assets/publicity/p5.jpeg'),
  require('../../assets/publicity/p6.jpeg'),
  require('../../assets/publicity/p7.jpeg'),
  require('../../assets/publicity/p8.jpeg'),
  require('../../assets/publicity/p9.jpeg'),
  require('../../assets/publicity/p10.jpeg'),
  require('../../assets/publicity/p11.jpeg'),
  require('../../assets/publicity/p12.jpeg'),
  // Add all your images here
];

const COLORS = {
  primaryBlue: '#003a70',
  white: '#ffffff',
  lightGray: '#f5f5f5',
};

const ImageSlideshow = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  
  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeIndex === slideshowImages.length - 1) {
        flatListRef.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      } else {
        flatListRef.current.scrollToIndex({
          index: activeIndex + 1,
          animated: true,
        });
      }
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, [activeIndex]);
  
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };
  
  const renderItem = ({ item }) => {
    return (
      <View style={styles.slideContainer}>
        <Image 
          source={item} 
          style={styles.image} 
          resizeMode="contain"
          onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
      </View>
    );
  };
  
  const scrollToImage = (index) => {
    flatListRef.current.scrollToIndex({
      index,
      animated: true,
    });
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slideshowImages}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ alignItems: 'center' }}
        snapToInterval={width}
        decelerationRate="fast"
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          });
        }}
      />
      
      {/* Navigation arrows */}
      <View style={styles.arrowsContainer}>
        <TouchableOpacity 
          style={styles.arrow}
          onPress={() => {
            const newIndex = activeIndex === 0 ? slideshowImages.length - 1 : activeIndex - 1;
            scrollToImage(newIndex);
          }}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.arrow}
          onPress={() => {
            const newIndex = activeIndex === slideshowImages.length - 1 ? 0 : activeIndex + 1;
            scrollToImage(newIndex);
          }}
        >
          <Ionicons name="chevron-forward" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
      {/* Pagination dots */}
      <View style={styles.pagination}>
        {slideshowImages.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
            onPress={() => scrollToImage(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 280,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  slideContainer: {
    width: width - 32,
    height: 250,
    marginHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primaryBlue,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  arrowsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageSlideshow;