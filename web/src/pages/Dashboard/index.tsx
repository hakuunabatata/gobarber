import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { isToday, format, parseISO, isAfter } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import DayPicker, { DayModifiers } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment,
} from './styles'

import logoImg from '../../assets/logo.svg'
import { FiClock, FiPower } from 'react-icons/fi'
import { useAuth } from '../../hooks/auth'
import api from '../../services/api'
import { date } from 'yup'

interface MonthAvailabilityItem {
  day: number
  available: boolean
}

interface Appointment {
  id: string
  date: string
  formattedHour: string
  user: {
    name: string
    avatar_url: string
  }
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth()
  const [selectedDate, selectDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthAvailabilty, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([])

  const [appointments, setAppointments] = useState<Appointment[]>([])

  const dateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) selectDate(day)
  }, [])

  const monthChange = useCallback((month: Date) => {
    setCurrentMonth(month)
  }, [])

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(res => {
        setMonthAvailability(res.data)
      })
  }, [currentMonth, user.id])

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(({ data }) => {
        const formattedAppointments = data.map(appoinment => ({
          ...appoinment,
          formattedHour: format(parseISO(appoinment.date), 'HH:mm'),
        }))
        setAppointments(formattedAppointments)
      })
  }, [selectedDate])

  const disabledDays = useMemo(() => {
    const dates = monthAvailabilty
      .filter(day => !day.available)
      .map(({ day }) => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        return new Date(year, month, day)
      })
    return dates
  }, [currentMonth, monthAvailabilty])

  const selectedDateAsText = useMemo(
    () => format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR }),
    [selectedDate],
  )

  const selectedWeekDay = useMemo(
    () => format(selectedDate, 'cccc', { locale: ptBR }),
    [selectedDate],
  )

  const morningAppointments = useMemo(
    () =>
      appointments.filter(
        appointment => parseISO(appointment.date).getHours() < 12,
      ),
    [appointments],
  )

  const afternoonAppointments = useMemo(
    () =>
      appointments.filter(
        appointment => parseISO(appointment.date).getHours() > 12,
      ),
    [appointments],
  )

  const nextAppointment = useMemo(
    () =>
      appointments.find(appointment =>
        isAfter(parseISO(appointment.date), new Date()),
      ),
    [appointments],
  )

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horarios agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento nesse periodo</p>
            )}

            {morningAppointments.map(({ user, id, formattedHour }) => (
              <Appointment key={id}>
                <span>
                  <FiClock />
                  {formattedHour}
                </span>

                <div>
                  <img src={user.avatar_url} alt={user.name} />

                  <strong>{user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento nesse periodo</p>
            )}

            {afternoonAppointments.map(({ user, id, formattedHour }) => (
              <Appointment key={id}>
                <span>
                  <FiClock />
                  {formattedHour}
                </span>

                <div>
                  <img src={user.avatar_url} alt={user.name} />

                  <strong>{user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[
              {
                daysOfWeek: [0, 6],
              },
              ...disabledDays,
            ]}
            modifiers={{
              available: {
                daysOfWeek: [1, 2, 3, 4, 5],
              },
            }}
            selectedDays={selectedDate}
            onMonthChange={monthChange}
            onDayClick={dateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  )
}

export default Dashboard
