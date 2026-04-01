import KkBackground from "@/components/KkBackground";
import KkButton from "@/components/KkButton";
import KkHeader from "@/components/KkHeader";
import KkTextBox from "@/components/KkTextBox";
import { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KkBackground>
      <KkHeader title="로그인 하기" variant="back" />
      <View style={styles.content}>
        <KkTextBox
          label="이메일"
          value={email}
          onChangeText={setEmail}
          placeholder="이메일을 입력해 주세요."
        />
        <KkTextBox
          label="비밀번호"
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호를 입력해 주세요."
        />

        <View style={styles.button}>
          <KkButton
            title="로그인 하기"
            disabled={!email || !password} onPress={() => { }}
          />
        </View>

        <View style={styles.container}>
          <TouchableOpacity onPress={() => console.log('아이디 찾기')}>
            <Text style={styles.text}>아이디 찾기</Text>
          </TouchableOpacity>

          <Text style={styles.text}> | </Text>

          <TouchableOpacity onPress={() => console.log('비밀번호 찾기')}>
            <Text style={styles.text}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KkBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
    gap: 16,
  },
  button: {
    paddingTop: 16,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 8,
    gap: 12,
  },
  text: {
    fontSize: 14,
    color: '#8D786D', 
  },
});
