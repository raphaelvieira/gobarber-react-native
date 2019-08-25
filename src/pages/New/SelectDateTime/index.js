import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Container, HourList, Hour, Title } from './styles';
import Background from '~/components/Background';
import DateInput from '~/components/DateInput';
import api from '~/services/api';

export default function SelectDateTime({ navigation }) {
  const provider = navigation.getParam('provider');
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState([]);

  useEffect(() => {
    async function loadAvailable() {
      const response = await api.get(`providers/${provider.id}/available`, {
        params: {
          date: date.getTime(),
        },
      });
      setHours(response.data);
    }
    loadAvailable();
  }, [date, provider.id]);

  function handleSelectHour(time) {
    navigation.navigate('Confirm', {
      provider,
      time,
    });
  }

  return (
    <Background>
      <Container>
        <DateInput date={date} onChange={setDate} />

        <HourList
          data={hours}
          keyExtractor={item => item.time}
          renderItem={({ item }) => (
            <Hour
              onPress={() => {
                handleSelectHour(item.value);
              }}
              enabled={item.available}
            >
              <Title>{item.time}</Title>
            </Hour>
          )}
        />
      </Container>
    </Background>
  );
}

SelectDateTime.navigationOptions = ({ navigation }) => ({
  title: 'Select Date and Time',
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
SelectDateTime.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
