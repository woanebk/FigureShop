import { Ionicons } from '@expo/vector-icons';
import React, {useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableWithoutFeedback } from 'react-native';
function LocationPin(props) {
    return (
        <View>
            <Ionicons icon="locationIcon" />
            <Text >{props.text}</Text>
        </View>
    )
}

export default LocationPin;