import React from 'react';
import PropTypes from 'prop-types';

export const bannerForUser = (user) => {
  if (user.enabled_modules.includes('payment_dispute')) {
    return <AccountLockedBanner />;
  } else if (user.recently_subscribed) {
    return <NewSubscriptionBanner />;
  } else if (user.account_status === "active_trial") {
    return <TrialActiveBanner endDate={new Date(user.trial_end_date)} />;
  } else if (["lapsed_trial", "lapsed_subscription"].includes(user.account_status)) {
    return <TrialExpiredBanner />;
  } else {
    return <HelpBanner />;
  }
}

export const HelpBanner = () => {
  return (
    <Banner
      title="Need any help?"
      text="Get in touch with us at hello@listify.ai if you need help or have any feedback."
    />
  )
};

export const NewSubscriptionBanner = () => {
  return (
    <Banner
      title="Thank you for subscribing!"
      text="We hope you enjoy using Listify - get in touch with us at hello@listify.ai if you need any help."
    />
  )
};

export const TrialActiveBanner = ({ endDate }) => {
  const endStr = endDate.toLocaleDateString('en-gb', { weekday:"long", month:"long", day:"numeric"});
  return (
    <Banner
      title="Welcome to your free trial of Listify!"
      text={`Your trial is active until ${endStr}. If there is anything we can help with please email hello@listify.ai.`}
    />
  )
}


export const TrialExpiredBanner = () => {
  return (
    <Banner
      title="Your trial has expired"
      text='You are limited to 5 spins per month. To access more, subscribe or contact hello@listify.ai.'
      noticeLevel='warning'
    />
  )
}

export const AccountLockedBanner = () => {
  return (
    <Banner
      title="There is an issue with your account"
      text="We have been notified that a payment to Listify from your card is disputed. Please contact us at hello@listify.ai to resolve this issue. Your access to the app has been limited as a precaution."
      noticeLevel='warning'
    />
  )
};

const Banner = ({ title, text, noticeLevel = 'info' }) => {
  const borderColor = noticeLevel === 'warning' ? 'border-orange-500' : 'border-teal-500';
  const iconColor   = noticeLevel === 'warning' ? 'text-orange-500' : 'text-teal-500';

  return (
    <div className={`py-3 px-4 text-left rounded-b border-l-4 ${borderColor} shadow border-t-1`} role="alert">
      <div className="flex items-center">
        <div className={`py-1 ${iconColor}`}>
          <svg className="mr-4 w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
          </svg>
        </div>
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-sm">{text}</p>
        </div>
      </div>
    </div>
  )
}

TrialActiveBanner.propTypes = {
  endDate: PropTypes.instanceOf(Date)
}

Banner.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  noticeLevel: PropTypes.string
};
