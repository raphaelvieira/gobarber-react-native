import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatRelative, parseISO } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import en from 'date-fns/locale/en-US';
import { Container, Avatar, Name, Time, SubmitButton } from './styles';
import Background from '~/components/Background';
import api from '~/services/api';

export default function Confirm({ navigation }) {
  const provider = navigation.getParam('provider');
  const time = navigation.getParam('time');

  const dateFormatted = useMemo(
    () => formatRelative(parseISO(time), new Date(), { locale: en }),
    [time]
  );

  async function handleAddAppoinment() {
    await api.post(`appointments`, {
      provider_id: provider.id,
      date: time,
    });

    navigation.navigate('Dashboard');
  }

  return (
    <Background>
      <Container>
        <Avatar
          source={{
            uri: provider.avatar
              ? provider.avatar.url
              : 'https://api.adorable.io/avatar/50/rocketseat.png',
          }}
        />
        <Name>{provider.name}</Name>
        <Time>{dateFormatted}</Time>

        <SubmitButton onPress={handleAddAppoinment}>
          Confirm Schedule
        </SubmitButton>
      </Container>
    </Background>
  );
}

Confirm.navigationOptions = ({ navigation }) => ({
  title: 'Confirm',
  headerTitleStyle: {
    marginLeft: 0,
  },
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Icon name="chevron-left" size={20} color="#fff" />
    </TouchableOpacity>
  ),
});
Confirm.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
