import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Completion from './Completion';
import { tableDate } from '../../helpers/utils';
import { getRequest } from '../../helpers/requests';

const Dashboard = ({ currentUser, groupedCompletions, showAdmins, last_24_hr_stats }) => {
  const [completionsInView, setCompletionsInView] = useState(groupedCompletions);
  const [adminsInView, setAdminsInView] = useState(showAdmins);
  const [searchQuery, setSearchQuery] = useState('');

  const headerBar = () => {
    return (
      <div className="flex justify-between items-center my-4 w-full">
        <h1 className="text-xl font-medium text-gray-900">Completions</h1>
        {currentUser.admin && <div className="flex items-center">
          {searchForm()}
          <a
            href={`/admin/recorded_completions${adminsInView ? '' : '?admin=true'}`}
            className="text-xs"
          >
            Toggle admins
          </a>
        </div>}
      </div>
    )
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getRequest(
      `/admin/recorded_completions/search?query=${searchQuery}`,
        (response) => { setCompletionsInView(response.grouped_completions); setAdminsInView(false); },
        (error) => { console.log(error) }
    )
  };

  const searchForm = () => {
    return (
      <form onSubmit={handleSearch} className="px-4 my-4 flex items-center">
        <label className="form-label mt-1">User:</label>
        <input
          type="text"
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-inline-field text-xs">
        </input>

        <button className="add-button mt-1">Search</button>
      </form>
    )
  };

  const formattedUserInput = (group) => {
    if (group.untranslated_input) {
      return (
        `${group.input_language_code} (original):\n${group.untranslated_input_text}\n\nEN (translated):\n${group.user_input}`
      )
    } else {
      return group.user_input;
    }
  };

  const tableRowFor = (group) => {
    return (
      <tr key={group.task_run_timestamp} className="text-xs">
        <td className="py-3 px-6">
          <p><strong>{group.user_email}</strong></p>
          <br />
          <p>{group.request_type}</p>
          <br />
          <p className="text-gray-500">{tableDate(new Date(group.task_run_timestamp))}</p>
        </td>
        <td className="py-3 px-6 whitespace-pre-wrap w-80">{formattedUserInput(group)}</td>
        <td>
          <div>
            {group.completions.map((c) => {
              return (
                <div key={c.id} className="grid grid-cols-4 pt-3">
                  <div className="py-3 px-6 mb-4 col-span-3"><Completion completion={c} /></div>
                  <div className="py-3 px-6 mb-4 col-span-1">
                    <p>api: {c.api_client}</p>
                    <p>filter: {c.ran_content_filter.toString()}</p>
                    <p>lang_in: {group.input_language_code}</p>
                    <p>lang_out: {c.completion_translation_codes.join(', ')}</p>
                    <a href={`/admin/recorded_completions/${c.id}`} className="secondary-link">Debug</a>
                  </div>
                </div>
              )
            })}
          </div>
        </td>
      </tr>
    )
  };

  const countFor = (key, object) => {
    return (
      <p key={key}>{key}: {object[key]}</p>
    )
  };

  const summaryTable = () => {
    const { spin_count, request_counts, user_counts } = last_24_hr_stats.table;
    return (
      <div className="w-max p-4 mb-4 text-sm border broder-gray-200 bg-white rounded-lg">
        <h3 className="font-medium mb-1">Last 24 hours ({spin_count} total spins)</h3>
        <div className="mb-4 w-full h-px bg-gray-200"></div>
        <div className="flex items-start">
          <div className="mr-8">
            <span className="font-medium">Request types:</span>
            {Object.keys(request_counts).map(k => countFor(k, request_counts))}
          </div>
          <div>
            <span className="font-medium">Users:</span>
            {Object.keys(user_counts).map(k => countFor(k, user_counts))}
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="w-full">
      {headerBar()}
      {summaryTable()}
      <div className="overflow-scroll bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              <th className="py-3 px-6">User Request</th>
              <th className="py-3 px-6">User Input</th>
              <th>
                <div className="grid grid-cols-4">
                  <span className="py-3 px-6 col-span-3 min-w-min">Completion</span>
                  <span className="py-3 px-6 col-span-1 min-w-min">Request Details</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {completionsInView.map(g => tableRowFor(g))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  currentUser: PropTypes.object,
  showAdmins: PropTypes.bool,
  groupedCompletions: PropTypes.array,
  last_24_hr_stats: PropTypes.object,
}

export default Dashboard;
