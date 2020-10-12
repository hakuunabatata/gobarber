import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Platform, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import { format } from 'date-fns'
import DateTimePicker from '@react-native-community/datetimepicker'

import { useAuth } from '../../hooks/auth'
import api from '../../services/api'

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles'

interface RouteParams {
  provider_id: string
}

export interface Provider {
  id: string
  name: string
  avatar_url: string
}

interface Availability {
  hour: number
  available: boolean
}

const CreateAppointment: React.FC = () => {
  const route = useRoute()
  const { provider_id } = route.params as RouteParams
  const [showDatePicker, changeDatePicker] = useState(false)
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedDate, selectDate] = useState(new Date())
  const [selectedHour, selectHour] = useState(0)
  const [selectedProviderID, selectProviderID] = useState(provider_id)
  const [availability, setAvailability] = useState<Availability[]>([])
  const { user } = useAuth()
  const { goBack, navigate } = useNavigation()

  useEffect(() => {
    api.get('providers').then(({ data }) => {
      setProviders(data)
    })
  }, [])

  useEffect(() => {
    api
      .get(`providers/${selectedProviderID}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(({ data }) => {
        setAvailability(data)
      })
  }, [selectedDate, selectedProviderID])

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  const selectProvider = useCallback((id: string) => {
    selectProviderID(id)
  }, [])

  const toggleDatePicker = useCallback(() => {
    changeDatePicker(state => !state)
  }, [])

  const changeDate = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      changeDatePicker(false)
    }
    if (date) selectDate(date)
  }, [])

  const handleSelectedHour = useCallback((hour: number) => {
    selectHour(hour)
  }, [])

  const submitAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate)

      date.setHours(selectedHour)
      date.setMinutes(0)

      await api.post('appointments', {
        provider_id: selectedProviderID,
        date,
      })

      navigate('AppointmentCreated', { date: date.getTime() })
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente',
      )
    }
  }, [navigate, selectedDate, selectedHour, selectedProviderID])

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour <= 12)
      .map(({ hour, available }) => ({
        hour,
        available,
        formattedHour: format(new Date().setHours(hour), 'HH:00'),
      }))
  }, [availability])

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour > 12)
      .map(({ hour, available }) => ({
        hour,
        available,
        formattedHour: format(new Date().setHours(hour), 'HH:00'),
      }))
  }, [availability])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={({ id }) => id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => selectProvider(provider.id)}
                selected={selectedProviderID === provider.id}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={selectedProviderID === provider.id}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={toggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              onChange={changeDate}
              value={selectedDate}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o Horario</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ formattedHour, hour, available }) => (
                <Hour
                  selected={selectedHour === hour}
                  onPress={() => handleSelectedHour(hour)}
                  available={available}
                  key={formattedHour}
                >
                  <HourText selected={selectedHour === hour}>
                    {formattedHour}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(
                ({ formattedHour, available, hour }) => (
                  <Hour
                    selected={selectedHour === hour}
                    onPress={() => handleSelectedHour(hour)}
                    available={available}
                    key={formattedHour}
                  >
                    <HourText selected={selectedHour === hour}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={submitAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  )
}
export default CreateAppointment
