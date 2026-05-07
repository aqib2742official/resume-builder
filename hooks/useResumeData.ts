import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export function useResumeData() {
  return useSelector((state: RootState) => state.resume.data)
}

export function usePersonal() {
  return useSelector((state: RootState) => state.resume.data.personal)
}

export function useExperience() {
  return useSelector((state: RootState) => state.resume.data.experience)
}

export function useEducation() {
  return useSelector((state: RootState) => state.resume.data.education)
}

export function useProjects() {
  return useSelector((state: RootState) => state.resume.data.projects)
}

export function useSkills() {
  return useSelector((state: RootState) => state.resume.data.skills)
}

export function useCertifications() {
  return useSelector((state: RootState) => state.resume.data.certifications)
}

export function useLanguages() {
  return useSelector((state: RootState) => state.resume.data.languages)
}

export function useAwards() {
  return useSelector((state: RootState) => state.resume.data.awards)
}

export function useVolunteer() {
  return useSelector((state: RootState) => state.resume.data.volunteer)
}

export function useInterests() {
  return useSelector((state: RootState) => state.resume.data.interests)
}

export function useCustomSections() {
  return useSelector((state: RootState) => state.resume.data.customSections)
}

export function useLastSaved() {
  return useSelector((state: RootState) => state.resume.lastSaved)
}
