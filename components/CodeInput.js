import {Animated, Image, SafeAreaView, Text, StyleSheet,Platform, View} from 'react-native';
import React, {useState} from 'react';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { BLACK } from '../common';

const CELL_SIZE = 40;
const CELL_BORDER_RADIUS = 8;
const DEFAULT_CELL_BG_COLOR = '#fff';
const NOT_EMPTY_CELL_BG_COLOR = '#3557b7';
const ACTIVE_CELL_BG_COLOR = '#f7fafe';

const {Value, Text: AnimatedText} = Animated;

const CELL_COUNT = 6;
const source = {
  uri:
    'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));

const animateCell = ({hasValue, index, isFocused}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const CodeInput = (props) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [propertys, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const renderCell = ({index, symbol, isFocused}) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({hasValue, index, isFocused});
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Nhập Mã Xác Nhận</Text>
      <Image style={styles.icon} source={source} />
      <Text style={styles.subTitle}>
        Mã đã được gửi đến số điện thoại của bạn{'\n'}
      </Text>

      <CodeField
        ref={ref}
        {...propertys}
        value={props.value}
        onChangeText={props.onChangeText}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFiledRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
    </SafeAreaView>
  );
};

export default CodeInput;

const styles = StyleSheet.create({
    codeFiledRoot: {
      height: CELL_SIZE,
      marginTop: 30,
      paddingHorizontal: 20,
      justifyContent: 'center',
    },
    cell: {
      marginHorizontal: 8,
      height: CELL_SIZE,
      width: CELL_SIZE,
      lineHeight: CELL_SIZE ,
      fontSize: 30,
      textAlign: 'center',
      borderRadius: CELL_BORDER_RADIUS,
      color: '#3759b8',
      backgroundColor: '#fff',
  
      // IOS
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
  
      // Android
      elevation: 3,
    },
  
    // =======================
  
    root: {
      //minHeight: 800,
      //backgroundColor:BLACK
    },
    title: {
      color: '#000',
      fontSize: 25,
      fontWeight: '700',
      textAlign: 'center',
    },
    icon: {
      width: 217 / 2.4,
      height: 158 / 2.4,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    subTitle: {
      paddingTop: 15,
      color: '#000',
      textAlign: 'center',
    },
  });