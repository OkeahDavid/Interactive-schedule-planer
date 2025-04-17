import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import * as dates from 'date-arithmetic'
import TimeGrid from '../../../../../../src/TimeGrid' // use 'react-big-calendar/lib/TimeGrid'. Can't 'alias' in Storybook
import { Navigate } from 'react-big-calendar'

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../../src/addons/dragAndDrop/styles.scss' // Todo: Probably this is not needed in most of the files.


export default function MyWeek({
  date,
  localizer,
  max = localizer.endOf(new Date(), 'day'),
  min = localizer.startOf(new Date(), 'day'),
  scrollToTime = localizer.startOf(new Date(), 'day'),
  ...props
}) {
  const currRange = useMemo(
    () => MyWeek.range(date, { localizer }),
    [date, localizer]
  )

  return (
    <TimeGrid
      date={date}
      eventOffset={15}
      localizer={localizer}
      max={max}
      min={min}
      range={currRange}
      scrollToTime={scrollToTime}
      {...props}
    />
  )
}

MyWeek.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  localizer: PropTypes.object,
  max: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
  scrollToTime: PropTypes.instanceOf(Date),
}

MyWeek.range = (date, { localizer }) => {
  let start = date
  start.setDate(start.getDate() - start.getDay()) // The beginning of the week
  const end = dates.add(start, 13, 'day') // Here you can alter the number of days that are displayed.

  let current = start
  const range = []

  while (localizer.lte(current, end, 'day')) {
    range.push(current)
    current = localizer.add(current, 1, 'day')
  }

  return range
}

MyWeek.navigate = (date, action, { localizer }) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return localizer.add(date, -7, 'day')

    case Navigate.NEXT:
      return localizer.add(date, 7, 'day')

    default:
      return date
  }
}

MyWeek.title = (date) => {
  return `Two weeks, ${date.toLocaleDateString()}`
}