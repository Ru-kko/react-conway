import { StyleProp, Text, TextInput, View, ViewStyle } from "react-native";
import { usePreferencesStore } from "../store";
import React from "react";

export function TextFormInpiut({
  onChange,
  svg,
  title,
  password = false,
  style,
  placeholder = "",
}: {
  onChange: (value: string) => void;
  svg?: React.ReactNode;
  title?: string;
  placeholder?: string;
  password?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { font, theme } = usePreferencesStore((s) => s.preferences);

  return (
    <View
      style={[
        {
          padding: 5,
          borderColor: theme.mauve,
          borderBottomWidth: 2,
          flexDirection: "column",
          alignItems: "flex-start",
        },
        style,
      ]}
    >
      {title && (
        <Text
          style={{ fontFamily: font.regular, color: theme.peach, fontSize: 20 }}
        >
          {title}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          width: "100%",
        }}
      >
        <TextInput
          onChangeText={onChange}
          style={{
            flex: 1,
            fontFamily: font.medium,
            color: theme.text,
            fontSize: 32,
          }}
          secureTextEntry={password}
          placeholder={placeholder}
          placeholderTextColor={theme.subtext1}
        />
        {svg && <View style={{ marginLeft: 10 }}>{svg}</View>}
      </View>
    </View>
  );
}
