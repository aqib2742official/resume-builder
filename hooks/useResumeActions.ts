import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import {
  updatePersonal, toggleSectionVisibility, loadResumeData,
  addExperience, updateExperience, removeExperience, moveExperience, duplicateExperience, reorderExperience,
  addEducation, updateEducation, removeEducation, moveEducation, duplicateEducation, reorderEducation,
  addProject, updateProject, removeProject, moveProject, duplicateProject, reorderProjects,
  addSkillCategory, updateSkillCategory, removeSkillCategory, moveSkillCategory, reorderSkills,
  addSkillToCategory, removeSkillFromCategory, updateSkillInCategory,
  addCertification, updateCertification, removeCertification, moveCertification, reorderCertifications,
  addLanguage, updateLanguage, removeLanguage, moveLanguage, reorderLanguages,
  addAward, updateAward, removeAward, moveAward, duplicateAward, reorderAwards,
  addVolunteer, updateVolunteer, removeVolunteer, reorderVolunteer,
  addInterest, removeInterest, setInterests,
  addCustomSection, updateCustomSection, removeCustomSection,
  addCustomSectionItem, updateCustomSectionItem, removeCustomSectionItem,
  loadSampleData, clearResume,
} from '@/store/resumeSlice'
import { toggleSection, setMobileTab, toggleDarkEditor, setMobileSheetOpen } from '@/store/uiSlice'
import type {
  PersonalInfo, WorkExperience, Education, Project,
  SkillCategory, Certification, Language, Award, VolunteerWork, CustomSection, CustomSectionItem,
} from '@/types/resume'

export function useResumeActions() {
  const dispatch = useDispatch<AppDispatch>()

  return {
    updatePersonal: (changes: Partial<PersonalInfo>) => dispatch(updatePersonal(changes)),
    toggleSectionVisibility: (key: string) => dispatch(toggleSectionVisibility(key)),

    addExperience: () => dispatch(addExperience()),
    updateExperience: (id: string, changes: Partial<WorkExperience>) => dispatch(updateExperience({ id, changes })),
    removeExperience: (id: string) => dispatch(removeExperience(id)),
    moveExperience: (id: string, direction: 'up' | 'down') => dispatch(moveExperience({ id, direction })),
    duplicateExperience: (id: string) => dispatch(duplicateExperience(id)),
    reorderExperience: (fromIndex: number, toIndex: number) => dispatch(reorderExperience({ fromIndex, toIndex })),

    addEducation: () => dispatch(addEducation()),
    updateEducation: (id: string, changes: Partial<Education>) => dispatch(updateEducation({ id, changes })),
    removeEducation: (id: string) => dispatch(removeEducation(id)),
    moveEducation: (id: string, direction: 'up' | 'down') => dispatch(moveEducation({ id, direction })),
    duplicateEducation: (id: string) => dispatch(duplicateEducation(id)),
    reorderEducation: (fromIndex: number, toIndex: number) => dispatch(reorderEducation({ fromIndex, toIndex })),

    addProject: () => dispatch(addProject()),
    updateProject: (id: string, changes: Partial<Project>) => dispatch(updateProject({ id, changes })),
    removeProject: (id: string) => dispatch(removeProject(id)),
    moveProject: (id: string, direction: 'up' | 'down') => dispatch(moveProject({ id, direction })),
    duplicateProject: (id: string) => dispatch(duplicateProject(id)),
    reorderProjects: (fromIndex: number, toIndex: number) => dispatch(reorderProjects({ fromIndex, toIndex })),

    addSkillCategory: () => dispatch(addSkillCategory()),
    updateSkillCategory: (id: string, changes: Partial<SkillCategory>) => dispatch(updateSkillCategory({ id, changes })),
    removeSkillCategory: (id: string) => dispatch(removeSkillCategory(id)),
    moveSkillCategory: (id: string, direction: 'up' | 'down') => dispatch(moveSkillCategory({ id, direction })),
    reorderSkills: (fromIndex: number, toIndex: number) => dispatch(reorderSkills({ fromIndex, toIndex })),
    addSkillToCategory: (categoryId: string, skill: string) => dispatch(addSkillToCategory({ categoryId, skill })),
    removeSkillFromCategory: (categoryId: string, skillIndex: number) => dispatch(removeSkillFromCategory({ categoryId, skillIndex })),
    updateSkillInCategory: (categoryId: string, skillIndex: number, value: string) => dispatch(updateSkillInCategory({ categoryId, skillIndex, value })),

    addCertification: () => dispatch(addCertification()),
    updateCertification: (id: string, changes: Partial<Certification>) => dispatch(updateCertification({ id, changes })),
    removeCertification: (id: string) => dispatch(removeCertification(id)),
    moveCertification: (id: string, direction: 'up' | 'down') => dispatch(moveCertification({ id, direction })),
    reorderCertifications: (fromIndex: number, toIndex: number) => dispatch(reorderCertifications({ fromIndex, toIndex })),

    addLanguage: () => dispatch(addLanguage()),
    updateLanguage: (id: string, changes: Partial<Language>) => dispatch(updateLanguage({ id, changes })),
    removeLanguage: (id: string) => dispatch(removeLanguage(id)),
    moveLanguage: (id: string, direction: 'up' | 'down') => dispatch(moveLanguage({ id, direction })),
    reorderLanguages: (fromIndex: number, toIndex: number) => dispatch(reorderLanguages({ fromIndex, toIndex })),

    addAward: () => dispatch(addAward()),
    updateAward: (id: string, changes: Partial<Award>) => dispatch(updateAward({ id, changes })),
    removeAward: (id: string) => dispatch(removeAward(id)),
    moveAward: (id: string, direction: 'up' | 'down') => dispatch(moveAward({ id, direction })),
    duplicateAward: (id: string) => dispatch(duplicateAward(id)),
    reorderAwards: (fromIndex: number, toIndex: number) => dispatch(reorderAwards({ fromIndex, toIndex })),

    addVolunteer: () => dispatch(addVolunteer()),
    updateVolunteer: (id: string, changes: Partial<VolunteerWork>) => dispatch(updateVolunteer({ id, changes })),
    removeVolunteer: (id: string) => dispatch(removeVolunteer(id)),
    reorderVolunteer: (fromIndex: number, toIndex: number) => dispatch(reorderVolunteer({ fromIndex, toIndex })),

    addInterest: (interest: string) => dispatch(addInterest(interest)),
    removeInterest: (index: number) => dispatch(removeInterest(index)),
    setInterests: (interests: string[]) => dispatch(setInterests(interests)),

    addCustomSection: () => dispatch(addCustomSection()),
    updateCustomSection: (id: string, changes: Partial<Pick<CustomSection, 'title'>>) => dispatch(updateCustomSection({ id, changes })),
    removeCustomSection: (id: string) => dispatch(removeCustomSection(id)),
    addCustomSectionItem: (sectionId: string) => dispatch(addCustomSectionItem(sectionId)),
    updateCustomSectionItem: (sectionId: string, itemId: string, changes: Partial<CustomSectionItem>) =>
      dispatch(updateCustomSectionItem({ sectionId, itemId, changes })),
    removeCustomSectionItem: (sectionId: string, itemId: string) => dispatch(removeCustomSectionItem({ sectionId, itemId })),

    loadResumeData: (data: import('@/types/resume').ResumeData) => dispatch(loadResumeData(data)),
    loadSampleData: () => dispatch(loadSampleData()),
    clearResume: () => dispatch(clearResume()),

    toggleSection: (key: string) => dispatch(toggleSection(key)),
    setMobileTab: (tab: 'editor' | 'preview') => dispatch(setMobileTab(tab)),
    toggleDarkEditor: () => dispatch(toggleDarkEditor()),
    setMobileSheetOpen: (open: boolean) => dispatch(setMobileSheetOpen(open)),
  }
}
