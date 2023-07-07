import React, { useRef, useState, useEffect } from 'react'
import './ExperienceBarResult.css' // Assuming you have a css file

const ExperienceBarResult = ({ oldExperience, currentExperience, experienceToNextLevel }) => {
  const percentage = Math.floor((currentExperience / experienceToNextLevel) * 100)
  const oldPercentage = Math.floor((oldExperience / experienceToNextLevel) * 100)
  const newPercentage= Math.floor(((currentExperience - oldExperience) / experienceToNextLevel) * 100)

  return (
    <div className="experienceResult-bar">
      {(oldExperience <= 0) ? (
        <div className="experienceResult-bar__fill2" style={{ width: `${percentage}%` }} />
      ) : (
        <>
          <div className="experienceResult-bar__fill" style={{ width: `${oldPercentage}%` }} />
          <div className="experienceResult-bar__fill2" style={{ width: `${newPercentage}%` }} />
        </>
      )}
    </div>
  )
}

export default ExperienceBarResult