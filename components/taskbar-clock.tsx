'use client';

import { useEffect, useId, useState, type ComponentProps } from 'react';
import { Chevron, DayButton, Root } from 'react-day-picker';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const longDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
const shortTime = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});
const fullTime = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
});
const shortDate = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

function CalendarChevron({ orientation }: ComponentProps<typeof Chevron>) {
  return (
    <span
      aria-hidden="true"
      className={`clock-calendar-arrow ${orientation}`}
    />
  );
}

const calendarComponents = { DayButton, Root, Chevron: CalendarChevron };

function AnalogClock({ now }: { now: Date }) {
  const id = useId();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  return (
    <svg className="clock-dial" viewBox="0 0 130 130" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-rim`} x2="0" y2="1">
          <stop stopColor="#fafcfc" />
          <stop offset=".45" stopColor="#9aa5ac" />
          <stop offset=".55" stopColor="#f4f7f8" />
          <stop offset="1" stopColor="#8d999f" />
        </linearGradient>
        <radialGradient id={`${id}-face`} cx=".35" cy=".22" r=".85">
          <stop stopColor="#fbfdfd" />
          <stop offset=".65" stopColor="#e2ecef" />
          <stop offset="1" stopColor="#fbfdfd" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="65" cy="65" r="56" />
        </clipPath>
      </defs>
      <circle cx="65" cy="66" r="63" fill="#000" opacity=".12" />
      <circle
        cx="65"
        cy="64"
        r="62"
        fill={`url(#${id}-rim)`}
        stroke="#7e888e"
      />
      <circle cx="65" cy="64" r="59.5" fill="none" stroke="#f9ffff" />
      <circle
        cx="65"
        cy="65"
        r="57"
        fill={`url(#${id}-face)`}
        stroke="#85959f"
      />
      <g clipPath={`url(#${id}-clip)`}>
        <path d="M9 67 119 37 65 65 36 116Z" fill="#a8bec5" opacity=".23" />
        <path d="M22 28 65 65 118 91 72 120Z" fill="#fff" opacity=".42" />
        <path d="M9 67 65 65 97 111 36 116Z" fill="#b8cbd0" opacity=".15" />
      </g>
      {Array.from({ length: 60 }, (_, tick) => (
        <line
          key={tick}
          x1="65"
          y1={tick % 5 === 0 ? 12 : 11.5}
          x2="65"
          y2={tick % 5 === 0 ? 17 : 14}
          transform={`rotate(${tick * 6} 65 65)`}
          stroke={tick % 5 === 0 ? '#61808d' : '#78919b'}
          strokeWidth={tick % 5 === 0 ? 1.7 : 0.8}
        />
      ))}
      <g strokeLinecap="round">
        <line
          x1="65"
          y1="69"
          x2="65"
          y2="32"
          stroke="#526d77"
          strokeWidth="2.5"
          transform={`rotate(${hours * 30} 65 65)`}
        />
        <line
          x1="65"
          y1="70"
          x2="65"
          y2="21"
          stroke="#526d77"
          strokeWidth="1.8"
          transform={`rotate(${minutes * 6} 65 65)`}
        />
        <line
          x1="65"
          y1="74"
          x2="65"
          y2="15"
          stroke="#777f80"
          strokeWidth=".9"
          transform={`rotate(${seconds * 6} 65 65)`}
        />
      </g>
      <circle cx="65" cy="65" r="2.6" fill="#506c78" />
      <circle cx="64.5" cy="64.5" r=".8" fill="#c6d8dd" />
    </svg>
  );
}

function ClockPanel({ now }: { now: Date }) {
  const [selected, setSelected] = useState<Date | undefined>(now);
  const [month, setMonth] = useState(now);

  return (
    <div className="clock-panel-inner">
      <button
        className="clock-today"
        type="button"
        title="Go to today"
        onClick={() => {
          setSelected(now);
          setMonth(now);
        }}
      >
        {longDate.format(now)}
      </button>
      <div className="clock-panel-body">
        <Calendar
          className="clock-calendar"
          mode="single"
          required
          selected={selected}
          onSelect={setSelected}
          month={month}
          onMonthChange={setMonth}
          today={now}
          fixedWeeks
          weekStartsOn={0}
          navLayout="around"
          formatters={{
            formatCaption: (date) =>
              `${date.toLocaleString('en-US', { month: 'long' })}, ${date.getFullYear()}`,
            formatWeekdayName: (date) =>
              date.toLocaleString('en-US', { weekday: 'short' }).slice(0, 2),
          }}
          classNames={{
            root: 'clock-calendar-root',
            months: 'clock-calendar-months',
            month: 'clock-calendar-month',
            month_caption: 'clock-calendar-caption',
            caption_label: 'clock-calendar-label',
            month_grid: 'clock-calendar-grid',
            weekdays: 'clock-calendar-weekdays',
            weekday: 'clock-calendar-weekday',
            week: 'clock-calendar-week',
            day: 'clock-calendar-day',
            day_button: 'clock-calendar-day-button',
            selected: 'is-selected',
            today: 'is-today',
            outside: 'is-outside',
            button_previous: 'clock-calendar-previous',
            button_next: 'clock-calendar-next',
          }}
          components={calendarComponents}
        />
        <div className="clock-panel-time">
          <AnalogClock now={now} />
          <time className="clock-digital" dateTime={now.toISOString()}>
            {fullTime.format(now)}
          </time>
        </div>
      </div>
    </div>
  );
}

export function TaskbarClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, open ? 1000 : 30_000);
    return () => window.clearInterval(timer);
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="taskbar-clock"
        aria-label="Date and time"
        title={now ? longDate.format(now) : 'Date and time'}
      >
        <time dateTime={now?.toISOString()}>
          <span>{now ? shortTime.format(now) : '\u00a0'}</span>
          <span>{now ? shortDate.format(now) : '\u00a0'}</span>
        </time>
      </PopoverTrigger>
      <PopoverContent
        className="clock-panel"
        positionerClassName="clock-panel-positioner"
        side="top"
        align="end"
        sideOffset={6}
        aria-label="Calendar and clock"
      >
        {now && <ClockPanel now={now} />}
      </PopoverContent>
    </Popover>
  );
}
