import React from 'react';
import PropTypes from 'prop-types';
import { tableDate } from '../../helpers/utils';

const Dashboard = ({ groupedCompletions }) => {
  console.log(groupedCompletions)

  const headerRow = () => {
    return (
      <div className="flex justify-between items-center my-4 w-full">
        <h1 className="text-xl font-medium text-gray-900">Completions</h1>
      </div>
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

  const displayCompletion = (completion) => {
    if (completion.result_error) {
      return displayError(completion.result_error, completion.prompt_title);
    } else if (completion.failed_filter) {
      return displayFiltered(completion.completion_text, completion.prompt_title)
    } else if (completion.completion_copied) {
      return displayCopied(completion.completion_text, completion.prompt_title);
    } else {
      return displayNormal(completion.completion_text, completion.prompt_title);
    }
  };

  const displayNormal = (completionText, promptTitle) => {
    return (
      <div>{completionText.trim()}<p>{formattedTitle(promptTitle)}</p></div>
    )
  };

  const displayFiltered = (completionText, promptTitle) => {
    const content = displayNormal(completionText, promptTitle);
    return (
      <div className='text-red-700'>FAILED FILTER: {content}</div>
    )
  };

  const displayCopied = (completionText, promptTitle) => {
    const content = displayNormal(completionText, promptTitle);
    return (
      <div className='text-green-600'>USER COPIED: {content}</div>
    )
  };

  const displayError = (error, promptTitle) => {
    const errorMsg = error.startsWith('<html>') ? error : error;
    const formattedError = <p className='text-red-700'>{errorMsg}</p>
    return (
      <div>{formattedError}{formattedTitle(promptTitle)}</div>
    )
  };

  const formattedTitle = (title) => {
    return (
      <span className='font-medium text-purple-800'>{title}</span>
    )
  };

  const tableRowFor = (group) => {
    return (
      <tr key={group.task_run_timestamp} className="text-xs">
        <td className="py-3 px-6">{tableDate(new Date(group.task_run_timestamp))}</td>
        <td className="py-3 px-6">{group.user_email}</td>
        <td className="py-3 px-6">{group.request_type}</td>
        <td className="py-3 px-6 whitespace-pre-wrap">{formattedUserInput(group)}</td>
        <td>
          <div>
            {group.completions.map((c) => {
              return (
                <div key={c.id} className="grid grid-cols-8 pt-3">
                  <div className="py-3 px-6 mb-4 col-span-4">{displayCompletion(c)}</div>
                  <div className="py-3 px-6 mb-4 col-span-1">{c.api_client}</div>
                  <div className="py-3 px-6 mb-4 col-span-1">{c.ran_content_filter.toString()}</div>
                  <div className="py-3 px-6 mb-4 col-span-1">
                    <p>in: {group.input_language_code}</p>
                    <p>out: {c.completion_translation_codes.join(', ')}</p>
                  </div>
                  <div className="py-3 px-6 mb-4 col-span-1">
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

  return (
    <div className="w-full">
      {headerRow()}
      <div className="overflow-scroll bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              <th className="py-3 px-6">Created</th>
              <th className="py-3 px-6">User</th>
              <th className="py-3 px-6">Request type</th>
              <th className="py-3 px-6">User Input</th>
              <th>
                <div className="grid grid-cols-8">
                  <span className="py-3 px-6 col-span-4">Completion</span>
                  <span className="py-3 px-6 col-span-1">Api</span>
                  <span className="py-3 px-6 col-span-1">Ran filter</span>
                  <span className="py-3 px-6 col-span-1">Language</span>
                  <span className="py-3 px-6 col-span-1">Debug</span>
                </div>
                </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {groupedCompletions.map(g => tableRowFor(g))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  groupedCompletions: PropTypes.array,
}

export default Dashboard;