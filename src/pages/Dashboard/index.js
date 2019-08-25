import React, { useEffect, useState } from 'react';
import { withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import api from '~/services/api';

import Background from '~/components/Background';
import Appointment from '~/components/Appointment';
import { Container, Title, List } from './styles';

function Dashboard({ isFocused }) {
  const [appointments, setAppointments] = useState([]);

  async function loadAppointments() {
    const response = await api.get('appointments');
    setAppointments(response.data);
  }

  useEffect(() => {
    if (isFocused) {
      loadAppointments();
    }
  }, [isFocused]);

  async function handleCancel(id) {
    const response = await api.delete(`appointments/${id}`);

    setAppointments(
      appointments.map(appointment =>
        appointment.id === id
          ? {
              ...appointment,
              cancelled_at: response.data.cancelled_at,
            }
          : appointment
      )
    );
    loadAppointments();
  }

  return (
    <Background>
      <Container>
        <Title> Schedule</Title>
        <List
          data={appointments}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Appointment onCancel={() => handleCancel(item.id)} data={item} />
          )}
        />
      </Container>
    </Background>
  );
}

function TabBarIcon({ tintColor }) {
  return <Icon name="event" size={20} color={tintColor} />;
}

TabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

Dashboard.navigationOptions = {
  tabBarLabel: 'Schedule',
  tabBarIcon: TabBarIcon,
};

Dashboard.propTypes = {
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Dashboard);
