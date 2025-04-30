import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  FlatList,
  Image,
  StatusBar,
  SafeAreaView,
  Platform,
  ScrollView,
  DayTabs,
  Header,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// BBNAC color theme
const COLORS = {
  primaryBlue: '#003a70', // Dark navy blue
  secondaryBlue: '#0077c8', // Lighter blue
  lightBlue: '#e5f1f8', // Very light blue for backgrounds
  white: '#ffffff',
  textDark: '#333333',
  borderColor: '#cccccc',
  errorColor: '#d32f2f',
  successColor: '#388e3c',
  warningColor: '#f57c00',
  highlightYellow: '#ffd700',
  red: '#e53935',
};

// Dummy data for program sessions
const DUMMY_SESSIONS = [
  // Day 1 - Thursday
  {
    id: '1',
    title: 'Breakfast',
    description: 'Breakfast on your own',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '06:30',
    endTime: '09:00',
    location: 'Various',
    track: 'Meal',
  },
  {
    id: '2',
    title: 'Check-in of Registered Delegates',
    description: 'Registration and check-in for all convention delegates',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '09:00',
    endTime: '21:00',
    location: 'TBA',
    track: 'Registration',
  },
  {
    id: '3',
    title: 'Private Meetings of Clans (Ebika)',
    description: 'Clan meetings as arranged by each clan',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '09:00',
    endTime: '17:00',
    location: 'TBA',
    track: 'Clan',
  },
  {
    id: '4',
    title: 'Young Adults Program: Welcome and Checking-in',
    description: 'Welcome session for young adults',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '09:00',
    endTime: '11:00',
    location: 'TBA',
    track: 'Youth',
  },
  {
    id: '5',
    title: 'Young Adults Program: Meet and Greet',
    description: 'Ice-breakers (Buganda games and/or American games)',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '11:00',
    endTime: '16:30',
    location: 'TBA',
    track: 'Youth',
  },
  {
    id: '6',
    title: 'Delegates\' Tour of Boston',
    description: 'City tour coordinated by Mr. Eddie Kawungu & the tours and transportation committee',
    speaker: 'Mr. Eddie Kawungu',
    speakerTitle: 'Tour Coordinator',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '12:00',
    endTime: '17:00',
    location: 'Boston',
    track: 'Tour',
  },
  {
    id: '7',
    title: 'Lunch',
    description: 'Lunch on your own',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '13:00',
    endTime: '14:00',
    location: 'Various',
    track: 'Meal',
  },
  {
    id: '8',
    title: 'Muslim Friday Prayer (Jumu\'ah)',
    description: 'Room can be provided if requested',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '13:00',
    endTime: '15:00',
    location: 'TBA',
    track: 'Worship',
  },
  {
    id: '9',
    title: 'Dinner',
    description: 'Finger Food Provided for Children. For others, on your own',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '17:00',
    endTime: '18:00',
    location: 'Ballroom',
    track: 'Meal',
  },
  {
    id: '10',
    title: 'Children\'s Rehearsals',
    description: 'Rehearsals for children\'s performances',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '18:00',
    endTime: '19:00',
    location: 'Ballroom',
    track: 'Children',
  },
  {
    id: '11',
    title: 'Pre-Opening Ceremonies',
    description: 'Opening Prayer, Ekitiibwa kya Buganda (Anthem), Uganda National Anthem, Canada National Anthem, USA National Anthem',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '19:00',
    endTime: '19:10',
    location: 'Ballroom',
    track: 'Ceremony',
  },
  {
    id: '12',
    title: 'Opening Remarks',
    description: 'Ggwanga Mujje Boston President, Young Adults Leaders, Children\'s Committee Leaders, and the chief guest',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '19:10',
    endTime: '20:00',
    location: 'Ballroom',
    track: 'Ceremony',
  },
  {
    id: '13',
    title: 'Fashion Show and Children\'s Performances',
    description: 'Cultural showcase and performances by children',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '20:00',
    endTime: '22:00',
    location: 'Ballroom',
    track: 'Cultural',
  },
  {
    id: '14',
    title: 'Young Adults Program: Movie Time',
    description: 'For ages 17-20',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '21:30',
    endTime: '23:00',
    location: 'A1',
    track: 'Youth',
  },
  {
    id: '15',
    title: 'Young Adults Program: Mix and Mingle',
    description: 'For ages 21 and above',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '21:30',
    endTime: '01:00',
    location: 'A2',
    track: 'Youth',
  },
  {
    id: '16',
    title: 'Entertainment for All (DJ)',
    description: 'Music and dancing',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Friday',
    date: '2025-05-23',
    startTime: '22:30',
    endTime: '01:00',
    location: 'Ballroom',
    track: 'Entertainment',
  },
  
  // Day 2 - Saturday, May 24, 2025
  {
    id: '17',
    title: 'Dduyiro (Physical Fitness)',
    description: '\'Buganda Yeetaaga Abantu Abalamu\' session with the Katikkiro',
    speaker: 'Katikkiro',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '06:00',
    endTime: '06:40',
    location: 'Gym',
    track: 'Fitness',
  },
  {
    id: '18',
    title: 'Check-in of Registered Delegates Continued',
    description: 'Ongoing registration and check-in',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '07:30',
    endTime: '21:00',
    location: 'TBA',
    track: 'Registration',
  },
  {
    id: '19',
    title: 'Breakfast',
    description: 'Please come prepared for the opening ceremony immediately following breakfast. Traditional Attire Recommended',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '07:00',
    endTime: '08:30',
    location: 'Various',
    track: 'Meal',
  },
  {
    id: '20',
    title: 'Opening Ceremony',
    description: 'Opening Prayer, Ekitiibwa kya Buganda (Anthem), Uganda National Anthem, Canada National Anthem, USA National Anthem, Welcome Entertainment by Children',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '09:00',
    endTime: '09:15',
    location: 'Ballroom',
    track: 'Ceremony',
  },
  {
    id: '21',
    title: 'Welcome Messages',
    description: 'President, Ggwanga Mujje Boston – Ms. Rebecca Nansasi (5 mins), BBNAC\'25 Chairman – Mr. Herbert Ddungu (5 mins), President BBNAC – Mr. Emmanuel W. Kivumbi (10 mins), Ssaabasajja Kabaka\'s Representative – Oweekitiibwa Henry Ndawula (5 mins), Minister for Buganda\'s Affairs Abroad, Oweekitiibwa Joseph Kawuki (5 mins)',
    speaker: 'Various Speakers',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '09:15',
    endTime: '09:45',
    location: 'Ballroom',
    track: 'Ceremony',
  },
  {
    id: '22',
    title: 'Ssaabasajja Kabaka\'s Message',
    description: 'Message delivered by Ssaabasajja Kabaka\'s messenger',
    speaker: 'Kabaka\'s Messenger',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '09:45',
    endTime: '10:00',
    location: 'Ballroom',
    track: 'Ceremony',
  },
  {
    id: '23',
    title: 'Katikkiro Answers Questions of the People',
    description: 'Q&A session with the Katikkiro',
    speaker: 'Katikkiro',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '10:00',
    endTime: '10:30',
    location: 'Ballroom',
    track: 'Plenary',
  },
  {
    id: '24',
    title: 'Performances by Children',
    description: 'Cultural performances by children',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '10:30',
    endTime: '10:40',
    location: 'Ballroom',
    track: 'Children',
  },
  {
    id: '25',
    title: 'Plenary Sessions: Presentations and Discussions',
    description: 'Various presentations and discussions on important topics',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '10:45',
    endTime: '13:55',
    location: 'Ballroom',
    track: 'Plenary',
  },
  {
    id: '27',
    title: 'Questions and Answers/Discussion',
    description: 'Q&A session following the presentation on Buganda\'s fight against poverty',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '11:10',
    endTime: '11:25',
    location: 'Ballroom',
    track: 'Plenary',
  },
  {
    id: '28',
    title: 'Performance by Children',
    description: 'Cultural performances by children',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '12:20',
    endTime: '12:30',
    location: 'Ballroom',
    track: 'Children',
  },
  {
    id: '29',
    title: 'Presentations on Mental Health Awareness',
    description: 'Presentations on Mental Health Awareness Efforts by BBNAC Member Associations',
    speaker: 'BBNAC Member Association Leaders',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '12:30',
    endTime: '13:05',
    location: 'Ballroom',
    track: 'Plenary',
  },
  {
    id: '30',
    title: 'Presentation on the Role of the Office of Omubaka',
    description: 'Detailed presentation about the Office of Omubaka',
    speaker: 'Oweekitiibwa Moses Ggayi Mayanja',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '13:10',
    endTime: '13:35',
    location: 'Ballroom',
    track: 'Plenary',
  },
  {
    id: '31',
    title: 'Lunch and Light Entertainment',
    description: 'Lunch break with entertainment',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '13:35',
    endTime: '15:00',
    location: 'Ballroom',
    track: 'Meal',
  },
  {
    id: '32',
    title: 'Special Interest/Break Away Sessions',
    description: 'Various special interest sessions',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Various',
    track: 'General',
  },
  {
    id: '33',
    title: 'Young Adults Program: Career Session',
    description: 'Career guidance and mentorship',
    speaker: 'Mr. Paul Mukuye and Ms. Naomi Mulira',
    speakerTitle: 'Career Mentors',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '15:00',
    endTime: '16:30',
    location: 'A2',
    track: 'Youth',
  },
  {
    id: '34',
    title: 'Education Consultancy',
    description: 'Helping Parents to Access Colleges for their children',
    speaker: 'Maggie Kironde Mukasa',
    speakerTitle: 'Education Consultant',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '15:00',
    endTime: '16:30',
    location: 'A3',
    track: 'Education',
  },
  {
    id: '35',
    title: 'Ssenga and Jjajja',
    description: 'Traditional cultural guidance session',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '15:00',
    endTime: '16:30',
    location: 'A4',
    track: 'Cultural',
  },
  {
    id: '36',
    title: 'Boat Cruise',
    description: 'Boat cruise (and for others, dinner On Your Own, Entertainment)',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '17:30',
    endTime: '22:00',
    location: 'TBA',
    track: 'Entertainment',
  },
  {
    id: '37',
    title: 'Young Adults Program: Dinner Together',
    description: 'Group dinner for young adults',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '19:00',
    endTime: '20:00',
    location: 'Various',
    track: 'Youth',
  },
  {
    id: '38',
    title: 'Young Adults Program: Cultural/Talent Show',
    description: 'Participants perform traditional dances, music, etc.',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '20:00',
    endTime: '22:00',
    location: 'A2',
    track: 'Cultural',
  },
  {
    id: '39',
    title: 'Entertainment - Live Performance & DJs',
    description: 'Live music and DJ entertainment',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Saturday',
    date: '2025-05-24',
    startTime: '22:00',
    endTime: '02:00',
    location: 'Ballroom',
    track: 'Entertainment',
  },
  
  // Day 3 - Sunday, May 25, 2025
  {
    id: '40',
    title: 'Ssaabasajja Kabaka 70th Birthday Run/Walk',
    description: 'Commemorative run/walk for Kabaka\'s birthday',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '06:30',
    endTime: '08:00',
    location: 'Gym/TBA',
    track: 'Fitness',
  },
  {
    id: '41',
    title: 'Breakfast (Babaka with Katikkiro)',
    description: 'Special breakfast for Babaka with Katikkiro',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '08:00',
    endTime: '09:00',
    location: 'TBA',
    track: 'Meal',
  },
  {
    id: '42',
    title: 'Breakfast for Everyone Else',
    description: 'Breakfast on your own',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '08:00',
    endTime: '09:00',
    location: 'On own',
    track: 'Meal',
  },
  {
    id: '43',
    title: 'Christian Sunday Prayers',
    description: 'Sunday worship service',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '09:00',
    endTime: '10:15',
    location: 'TBA',
    track: 'Worship',
  },
  {
    id: '44',
    title: 'Check-in of Registered Delegates Continued',
    description: 'Ongoing registration and check-in',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '10:00',
    endTime: '15:00',
    location: 'TBA',
    track: 'Registration',
  },
  {
    id: '45',
    title: 'Children\'s Tours',
    description: 'Guided tours for children',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '11:00',
    endTime: '15:00',
    location: 'TBA',
    track: 'Children',
  },
  {
    id: '46',
    title: 'Young Adults Program: Mental Health Awareness',
    description: 'Presentation on mental health awareness',
    speaker: 'Anisha Makumbi and Diana Claire',
    speakerTitle: 'Mental Health Advocates',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '10:30',
    endTime: '11:30',
    location: 'A2',
    track: 'Youth',
  },
  {
    id: '47',
    title: 'Education Consultancy',
    description: 'Helping Parents to Access Colleges for their children',
    speaker: 'Maggie Kironde Musoke',
    speakerTitle: 'Education Consultant',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '10:30',
    endTime: '11:00',
    location: 'A3',
    track: 'Education',
  },
  {
    id: '48',
    title: 'Young Adults Program: STDs Transmission and Prevention',
    description: 'Presentation on STDs and personal stories',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '11:30',
    endTime: '12:30',
    location: 'A2',
    track: 'Youth',
  },
  {
    id: '49',
    title: 'Lunch',
    description: 'Lunch on your own',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '12:30',
    endTime: '13:30',
    location: 'Various',
    track: 'Meal',
  },
  {
    id: '50',
    title: 'BBNAC Annual General Assembly',
    description: 'Annual meeting of BBNAC members',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Ballroom/TBA',
    track: 'General',
  },
  {
    id: '51',
    title: 'Young Adults Program: Ssenga and Jjajja',
    description: 'Separate rooms for boys and girls',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '15:30',
    endTime: '16:30',
    location: 'A2',
    track: 'Cultural',
  },
  {
    id: '52',
    title: 'Presentation and Discussion on Land Matters',
    description: 'Information session about land issues',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '15:30',
    endTime: '16:30',
    location: 'A3',
    track: 'Education',
  },
  {
    id: '53',
    title: 'Gomesi (Busuuti) Dressing Lesson',
    description: 'A lesson on how to dress in a Gomesi for all interested girls and women',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '15:30',
    endTime: '16:30',
    location: 'A4',
    track: 'Cultural',
  },
  {
    id: '54',
    title: 'Immigration Consultations',
    description: 'Immigration advice and consultation',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '15:30',
    endTime: '16:30',
    location: 'A5',
    track: 'Education',
  },
  {
    id: '55',
    title: 'Free Time',
    description: 'Free time to get ready for the Royal Dinner',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '16:30',
    endTime: '17:30',
    location: 'Various',
    track: 'Break',
  },
  {
    id: '56',
    title: 'Closing Ceremony and Royal Dinner Start',
    description: 'Dress Code: Traditional attire recommended. Closing Prayer, Ekitiibwa kya Buganda (Anthem), Uganda National Anthem, Canada National Anthem, USA National Anthem',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '17:45',
    endTime: '18:00',
    location: 'Ballroom',
    track: 'Ceremony',
  },
  {
    id: '57',
    title: 'Welcome by the Host Mubaka',
    description: 'Welcome address',
    speaker: 'Oweekitiibwa Henry Ndawula',
    speakerTitle: 'Host Mubaka',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '18:00',
    endTime: '18:10',
    location: 'Ballroom',
    track: 'Ceremony',
  },
  // Continue Sunday, May 25, 2025 evening events
  {
    id: '59',
    title: 'Minister for Buganda Affairs Abroad Closing Remarks',
    description: 'Closing remarks from the Minister for Buganda Affairs Abroad',
    speaker: '',
    speakerTitle: 'Minister for Buganda Affairs Abroad',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '18:30',
    endTime: '18:40',
    location: 'Ballroom',
    track: 'Ceremony',
  },
  {
    id: '60',
    title: 'Keynote Speech by the Katikkiro of Buganda',
    description: 'Keynote address',
    speaker: 'Oweekitiibwa Charles Peter Mayiga',
    speakerTitle: 'Katikkiro of Buganda',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '18:40',
    endTime: '19:20',
    location: 'Ballroom',
    track: 'Ceremony',
  },
  {
    id: '61',
    title: 'Royal Dinner',
    description: 'Formal dinner',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '19:20',
    endTime: '21:00',
    location: 'Ballroom',
    track: 'Meal',
  },
  {
    id: '62',
    title: 'Closing Ceremony',
    description: 'Vote of thanks from the convention Chairman, Closing remarks by the President of Ggwanga Mujje Boston, BBNAC President reads convention resolutions, BBNAC President announces the host of the next convention (BBNAC\'27), BBNAC President passes out awards, UNAMS, Young Adults Representative',
    speaker: 'Various Speakers',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '21:00',
    endTime: '22:30',
    location: 'Ballroom',
    track: 'Ceremony',
  },
  {
    id: '63',
    title: 'Entertainment',
    description: 'Music and dancing',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Sunday',
    date: '2025-05-25',
    startTime: '22:30',
    endTime: '02:00',
    location: 'Ballroom',
    track: 'Entertainment',
  },
  
  // Day 4 - Monday, May 26, 2025
  {
    id: '64',
    title: 'Breakfast and Farewell',
    description: 'Breakfast on your own and farewells',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Monday',
    date: '2025-05-26',
    startTime: '07:00',
    endTime: '09:00',
    location: 'Various',
    track: 'Meal',
  },
  {
    id: '65',
    title: 'Tours for Extended Stay Guests',
    description: 'Tours for those staying longer and interested',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    day: 'Monday',
    date: '2025-05-26',
    startTime: '10:00',
    endTime: '15:00',
    location: 'TBA',
    track: 'Tour',
  }

];

// Track colors for visual differentiation
const TRACK_COLORS = {
  'General': '#6a7fc8',
  'Education': '#4caf50',
  'Worship': '#9c27b0',
  'Outreach': '#ff9800',
  'Break': '#9e9e9e',
  'Spiritual': '#8d6e63',
  'Technology': '#00bcd4',
  'Youth': '#e91e63',
  'History': '#795548',
  'Pastoral': '#3f51b5',
  'Missions': '#f44336',
  'Leadership': '#ffc107',
  'Meal': '#ff5722',
  'Registration': '#607d8b',
  'Clan': '#673ab7',
  'Tour': '#009688',
  'Children': '#cddc39',
  'Ceremony': '#3f51b5',
  'Entertainment': '#9c27b0',
  'Fitness': '#ff5722',
  'Plenary': '#2196f3',
  'Cultural': '#ff4081',
};

const { width } = Dimensions.get('window');

// Create a separate component for session items
const SessionItem = React.memo(({ item, index, isActive, isExpanded, selectedDay, pulseAnim, onToggleExpand }) => {
  const itemAnimValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(itemAnimValue, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [selectedDay, index]);
  
  const itemTranslate = itemAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });
  
  const itemOpacity = itemAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
  return (
    <Animated.View 
      style={[
        styles.sessionItem,
        { 
          transform: [{ translateY: itemTranslate }],
          opacity: itemOpacity,
          borderLeftColor: TRACK_COLORS[item.track] || COLORS.primaryBlue,
          borderLeftWidth: 4,
        },
        isActive && { 
          transform: [{ scale: pulseAnim }],
          borderWidth: 1,
          borderColor: COLORS.highlightYellow,
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.sessionHeader}
        onPress={() => onToggleExpand(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.sessionTimeLocation}>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color={COLORS.secondaryBlue} />
            <Text style={styles.sessionTime}>
              {item.startTime} - {item.endTime}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={COLORS.secondaryBlue} />
            <Text style={styles.sessionLocation}>{item.location}</Text>
          </View>
        </View>
        
        <View style={styles.sessionMain}>
          <View style={styles.sessionTitleRow}>
            <Text style={styles.sessionTitle}>{item.title}</Text>
            {isActive && (
              <View style={styles.liveIndicator}>
                <Text style={styles.liveIndicatorText}>LIVE</Text>
              </View>
            )}
          </View>
          
          {item.speaker ? (
            <View style={styles.speakerRow}>
              {item.speakerImage ? (
                <Image 
                  source={{ uri: item.speakerImage }} 
                  style={styles.speakerImage} 
                />
              ) : (
                <View style={styles.speakerImagePlaceholder}>
                  <Ionicons name="person" size={16} color={COLORS.white} />
                </View>
              )}
              <View style={styles.speakerInfo}>
                <Text style={styles.speakerName}>{item.speaker}</Text>
                {item.speakerTitle ? (
                  <Text style={styles.speakerTitle}>{item.speakerTitle}</Text>
                ) : null}
              </View>
            </View>
          ) : null}
          
          <View style={styles.trackBadge}>
            <Text style={styles.trackText}>{item.track}</Text>
          </View>
        </View>
        
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={COLORS.secondaryBlue} 
          style={styles.expandIcon}
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.sessionDetails}>
          <Text style={styles.sessionDescription}>{item.description}</Text>
        </View>
      )}
    </Animated.View>
  );
});

export default function ProgramScreen() {
  const [selectedDay, setSelectedDay] = useState('Friday');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pulseAnim] = useState(new Animated.Value(1));
  const [expandedSession, setExpandedSession] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });
  
  // Filter sessions by selected day
  const filteredSessions = DUMMY_SESSIONS.filter(
    session => session.day === selectedDay
  );

  // Start pulse animation for active sessions
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // For demo purposes, we'll simulate the convention happening today
  // This allows us to show "active" sessions
  const isSessionActive = (session) => {
    // Get current hours and minutes
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    // Check if current time is between session start and end times
    return currentTimeString >= session.startTime && currentTimeString <= session.endTime;
  };

  // Toggle session expanded state
  const toggleSessionExpanded = (sessionId) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Render day tabs
  const renderDayTabs = () => {
    const days = ['Friday', 'Saturday', 'Sunday', 'Monday']; // Updated to match the BBNAC'25 program
    
    return (
      <View style={styles.dayTabsContainer}>
        {days.map(day => {
          const isActive = selectedDay === day;
          
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayTab,
                isActive && styles.dayTabActive
              ]}
              onPress={() => setSelectedDay(day)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayTabText,
                isActive && styles.dayTabTextActive
              ]}>
                {day}
              </Text>
              {isActive && <View style={styles.dayTabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Simplified renderSessionItem function that doesn't use hooks
  const renderSessionItem = ({ item, index }) => {
    const isActive = isSessionActive(item);
    const isExpanded = expandedSession === item.id;
    
    return (
      <SessionItem
        item={item}
        index={index}
        isActive={isActive}
        isExpanded={isExpanded}
        selectedDay={selectedDay}
        pulseAnim={pulseAnim}
        onToggleExpand={toggleSessionExpanded}
      />
    );
  };

  // Main component return
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Program Schedule</Text>
        <Text style={styles.headerSubtitle}>BBNAC Annual Convention</Text>
      </View>
      
      {/* Day tabs */}
      {renderDayTabs()}
      
      {/* Sessions list */}
      <FlatList
        data={filteredSessions}
        renderItem={renderSessionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.sessionsList}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color={COLORS.borderColor} />
            <Text style={styles.emptyText}>No sessions scheduled for this day</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.lightBlue,
  },
  dayTabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dayTab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTabActive: {
    backgroundColor: COLORS.white,
  },
  dayTabText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  dayTabTextActive: {
    color: COLORS.primaryBlue,
    fontWeight: 'bold',
  },
  dayTabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '50%',
    backgroundColor: COLORS.primaryBlue,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  sessionsList: {
    padding: 12,
  },
  sessionItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sessionHeader: {
    padding: 16,
  },
  sessionTimeLocation: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  sessionTime: {
    fontSize: 14,
    color: COLORS.secondaryBlue,
    marginLeft: 4,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionLocation: {
    fontSize: 14,
    color: COLORS.secondaryBlue,
    marginLeft: 4,
  },
  sessionMain: {
    marginBottom: 8,
  },
  sessionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1,
  },
  liveIndicator: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  liveIndicatorText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  speakerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  speakerImagePlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.secondaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  speakerTitle: {
    fontSize: 13,
    color: COLORS.textDark,
    opacity: 0.7,
  },
  trackBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  trackText: {
    fontSize: 12,
    color: COLORS.primaryBlue,
    fontWeight: '500',
  },
  expandIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  sessionDetails: {
    padding: 16,
    backgroundColor: COLORS.lightBlue,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  sessionDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textDark,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textDark,
    textAlign: 'center',
  },
});