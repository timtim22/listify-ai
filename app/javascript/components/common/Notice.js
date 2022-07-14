import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import PropTypes from 'prop-types';

const Notice = ({ message, timeoutAfter = 5000 }) => {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), timeoutAfter);
    return () => clearTimeout(timer);
  }, []);

  const noticeContent = () => {
    return (
      <div className="fixed right-4 bottom-4 py-4 pr-8 text-left bg-teal-100 border-t-4 border-teal-500 shadow" role="alert">
        <div className="flex items-center">
          <div className="px-5">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L9 12L13 8M19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C8.8181 19 7.64778 18.7672 6.55585 18.3149C5.46392 17.8626 4.47177 17.1997 3.63604 16.364C2.80031 15.5282 2.13738 14.5361 1.68508 13.4442C1.23279 12.3522 1 11.1819 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1C12.3869 1 14.6761 1.94821 16.364 3.63604C18.0518 5.32387 19 7.61305 19 10Z" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm tracking-wide text-teal-900">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Transition
      show={!timedOut}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {noticeContent()}
    </Transition>
  )
};

Notice.propTypes = {
  message: PropTypes.string,
  timeoutAfter: PropTypes.number
}

export default Notice;
