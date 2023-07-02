import React, { useRef, useState, useEffect } from 'react'
import './ExperienceBar.css' // Assuming you have a css file

const ExperienceBar = ({ currentExperience, experienceToNextLevel }) => {
  const percentage = Math.floor((currentExperience / experienceToNextLevel) * 100)

  return (
    <div className="experience-bar">
      <div className="experience-bar__fill" style={{ width: `${percentage}%` }} />
    </div>
  )
}

export default ExperienceBar
