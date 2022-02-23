import React, { useState, useEffect } from 'react';
import { getRequest, createRequest } from '../../helpers/requests';

const UploadForm = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (loading) {
      setTimeout(() => fetchCSV(), 3000)
    }
  }, [loading]);

	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
	};

  const downloadFile = (response) => {
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'profile_summaries.csv');
    document.body.appendChild(link);
    link.click();
  };

  const fetchCSV = () => {
    setLoading(false);
    getRequest(
      '/recruitments/fetch_job',
      (response) => downloadFile(response),
      (err) => console.log(err),
    )
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createRequest(
      "/recruitments/create_job.json",
      {
        recruitment: { file_name: 'Test' }
      },
      (response) => { console.log(response) },
      (e) => { console.log(e); setLoading(false) }
    )
  }

  const spinner = () => {
    if (loading) {
      return (
        <div className="mt-8 flex items-end py-2">
          <p>Generating...</p>
          <div className="ml-12 flex w-5 h-5">
            <div className={`border-blue-600 animate-spin rounded-full h-6 w-6 border-t-2 border-b-2`}></div>
          </div>
        </div>
      )
    }
  };

  const submitDisabled = loading || !selectedFile;

  return (
    <div>
      <form className="flex flex-col items-start w-full" onSubmit={handleSubmit}>
        <input type="file" name="file" onChange={changeHandler} />
        <button disabled={submitDisabled} className={`${submitDisabled ? "cursor-not-allowed opacity-50" : ""} mt-8 primary-button`}>
          Upload
        </button>
        {spinner()}
      </form>
    </div>
  )
}

export default UploadForm;
