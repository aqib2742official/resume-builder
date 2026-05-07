import { createSlice, PayloadAction, current } from '@reduxjs/toolkit'
import { arrayMove } from '@dnd-kit/sortable'
import type {
  ResumeData, PersonalInfo, WorkExperience, Education, Project,
  SkillCategory, Certification, Language, Award, VolunteerWork, CustomSection, CustomSectionItem,
} from '@/types/resume'
import { defaultResume } from '@/constants/defaultResume'
import { sampleResumeData } from '@/lib/sampleData'

const MAX_HISTORY = 25

interface ResumeState {
  data: ResumeData
  past: ResumeData[]
  future: ResumeData[]
  lastSaved: string | null
}

const initialState: ResumeState = {
  data: defaultResume,
  past: [],
  future: [],
  lastSaved: null,
}

function snapshot(state: ResumeState) {
  state.past.push(current(state.data))
  if (state.past.length > MAX_HISTORY) state.past.shift()
  state.future = []
  state.lastSaved = new Date().toISOString()
}

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // ── History ──────────────────────────────────────────────────────────────
    undo(state) {
      if (state.past.length === 0) return
      state.future.unshift(current(state.data))
      if (state.future.length > MAX_HISTORY) state.future.pop()
      state.data = state.past.pop()!
    },
    redo(state) {
      if (state.future.length === 0) return
      state.past.push(current(state.data))
      if (state.past.length > MAX_HISTORY) state.past.shift()
      state.data = state.future.shift()!
    },

    // ── Personal ──────────────────────────────────────────────────────────────
    updatePersonal(state, action: PayloadAction<Partial<PersonalInfo>>) {
      snapshot(state)
      state.data.personal = { ...state.data.personal, ...action.payload }
    },

    // ── Section Visibility ────────────────────────────────────────────────────
    toggleSectionVisibility(state, action: PayloadAction<string>) {
      const key = action.payload
      const hidden = state.data.hiddenSections
      const index = hidden.indexOf(key)
      if (index === -1) hidden.push(key)
      else hidden.splice(index, 1)
      state.lastSaved = new Date().toISOString()
    },

    // ── Experience ────────────────────────────────────────────────────────────
    addExperience(state) {
      snapshot(state)
      state.data.experience.push({
        id: crypto.randomUUID(), company: '', position: '', location: '',
        startDate: '', endDate: '', currentlyWorking: false, bullets: [''],
      })
    },
    updateExperience(state, action: PayloadAction<{ id: string; changes: Partial<WorkExperience> }>) {
      snapshot(state)
      const item = state.data.experience.find((e) => e.id === action.payload.id)
      if (item) Object.assign(item, action.payload.changes)
    },
    removeExperience(state, action: PayloadAction<string>) {
      snapshot(state)
      state.data.experience = state.data.experience.filter((e) => e.id !== action.payload)
    },
    moveExperience(state, action: PayloadAction<{ id: string; direction: 'up' | 'down' }>) {
      snapshot(state)
      const { id, direction } = action.payload
      const arr = state.data.experience
      const i = arr.findIndex((e) => e.id === id)
      const j = direction === 'up' ? i - 1 : i + 1
      if (j >= 0 && j < arr.length) [arr[i], arr[j]] = [arr[j], arr[i]]
    },
    duplicateExperience(state, action: PayloadAction<string>) {
      snapshot(state)
      const item = state.data.experience.find((e) => e.id === action.payload)
      if (item) {
        const i = state.data.experience.indexOf(item)
        state.data.experience.splice(i + 1, 0, { ...current(item), id: crypto.randomUUID(), bullets: [...item.bullets] })
      }
    },
    reorderExperience(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      snapshot(state)
      const { fromIndex, toIndex } = action.payload
      state.data.experience = arrayMove([...state.data.experience], fromIndex, toIndex)
    },

    // ── Education ─────────────────────────────────────────────────────────────
    addEducation(state) {
      snapshot(state)
      state.data.education.push({
        id: crypto.randomUUID(), institution: '', degree: '', fieldOfStudy: '',
        location: '', startDate: '', endDate: '', description: '',
      })
    },
    updateEducation(state, action: PayloadAction<{ id: string; changes: Partial<Education> }>) {
      snapshot(state)
      const item = state.data.education.find((e) => e.id === action.payload.id)
      if (item) Object.assign(item, action.payload.changes)
    },
    removeEducation(state, action: PayloadAction<string>) {
      snapshot(state)
      state.data.education = state.data.education.filter((e) => e.id !== action.payload)
    },
    moveEducation(state, action: PayloadAction<{ id: string; direction: 'up' | 'down' }>) {
      snapshot(state)
      const { id, direction } = action.payload
      const arr = state.data.education
      const i = arr.findIndex((e) => e.id === id)
      const j = direction === 'up' ? i - 1 : i + 1
      if (j >= 0 && j < arr.length) [arr[i], arr[j]] = [arr[j], arr[i]]
    },
    duplicateEducation(state, action: PayloadAction<string>) {
      snapshot(state)
      const item = state.data.education.find((e) => e.id === action.payload)
      if (item) {
        const i = state.data.education.indexOf(item)
        state.data.education.splice(i + 1, 0, { ...current(item), id: crypto.randomUUID() })
      }
    },
    reorderEducation(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      snapshot(state)
      state.data.education = arrayMove([...state.data.education], action.payload.fromIndex, action.payload.toIndex)
    },

    // ── Projects ──────────────────────────────────────────────────────────────
    addProject(state) {
      snapshot(state)
      state.data.projects.push({
        id: crypto.randomUUID(), title: '', techStack: '', liveLink: '', githubLink: '', bullets: [''],
      })
    },
    updateProject(state, action: PayloadAction<{ id: string; changes: Partial<Project> }>) {
      snapshot(state)
      const item = state.data.projects.find((p) => p.id === action.payload.id)
      if (item) Object.assign(item, action.payload.changes)
    },
    removeProject(state, action: PayloadAction<string>) {
      snapshot(state)
      state.data.projects = state.data.projects.filter((p) => p.id !== action.payload)
    },
    moveProject(state, action: PayloadAction<{ id: string; direction: 'up' | 'down' }>) {
      snapshot(state)
      const { id, direction } = action.payload
      const arr = state.data.projects
      const i = arr.findIndex((p) => p.id === id)
      const j = direction === 'up' ? i - 1 : i + 1
      if (j >= 0 && j < arr.length) [arr[i], arr[j]] = [arr[j], arr[i]]
    },
    duplicateProject(state, action: PayloadAction<string>) {
      snapshot(state)
      const item = state.data.projects.find((p) => p.id === action.payload)
      if (item) {
        const i = state.data.projects.indexOf(item)
        state.data.projects.splice(i + 1, 0, { ...current(item), id: crypto.randomUUID(), bullets: [...item.bullets] })
      }
    },
    reorderProjects(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      snapshot(state)
      state.data.projects = arrayMove([...state.data.projects], action.payload.fromIndex, action.payload.toIndex)
    },

    // ── Skills ────────────────────────────────────────────────────────────────
    addSkillCategory(state) {
      snapshot(state)
      state.data.skills.push({ id: crypto.randomUUID(), category: '', skills: [] })
    },
    updateSkillCategory(state, action: PayloadAction<{ id: string; changes: Partial<SkillCategory> }>) {
      snapshot(state)
      const item = state.data.skills.find((s) => s.id === action.payload.id)
      if (item) Object.assign(item, action.payload.changes)
    },
    removeSkillCategory(state, action: PayloadAction<string>) {
      snapshot(state)
      state.data.skills = state.data.skills.filter((s) => s.id !== action.payload)
    },
    moveSkillCategory(state, action: PayloadAction<{ id: string; direction: 'up' | 'down' }>) {
      snapshot(state)
      const { id, direction } = action.payload
      const arr = state.data.skills
      const i = arr.findIndex((s) => s.id === id)
      const j = direction === 'up' ? i - 1 : i + 1
      if (j >= 0 && j < arr.length) [arr[i], arr[j]] = [arr[j], arr[i]]
    },
    reorderSkills(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      snapshot(state)
      state.data.skills = arrayMove([...state.data.skills], action.payload.fromIndex, action.payload.toIndex)
    },
    addSkillToCategory(state, action: PayloadAction<{ categoryId: string; skill: string }>) {
      snapshot(state)
      const cat = state.data.skills.find((s) => s.id === action.payload.categoryId)
      if (cat && action.payload.skill.trim()) cat.skills.push(action.payload.skill.trim())
    },
    removeSkillFromCategory(state, action: PayloadAction<{ categoryId: string; skillIndex: number }>) {
      snapshot(state)
      const cat = state.data.skills.find((s) => s.id === action.payload.categoryId)
      if (cat) cat.skills.splice(action.payload.skillIndex, 1)
    },
    updateSkillInCategory(state, action: PayloadAction<{ categoryId: string; skillIndex: number; value: string }>) {
      snapshot(state)
      const cat = state.data.skills.find((s) => s.id === action.payload.categoryId)
      if (cat) cat.skills[action.payload.skillIndex] = action.payload.value
    },

    // ── Certifications ────────────────────────────────────────────────────────
    addCertification(state) {
      snapshot(state)
      state.data.certifications.push({ id: crypto.randomUUID(), title: '', issuer: '', date: '', credentialLink: '' })
    },
    updateCertification(state, action: PayloadAction<{ id: string; changes: Partial<Certification> }>) {
      snapshot(state)
      const item = state.data.certifications.find((c) => c.id === action.payload.id)
      if (item) Object.assign(item, action.payload.changes)
    },
    removeCertification(state, action: PayloadAction<string>) {
      snapshot(state)
      state.data.certifications = state.data.certifications.filter((c) => c.id !== action.payload)
    },
    moveCertification(state, action: PayloadAction<{ id: string; direction: 'up' | 'down' }>) {
      snapshot(state)
      const { id, direction } = action.payload
      const arr = state.data.certifications
      const i = arr.findIndex((c) => c.id === id)
      const j = direction === 'up' ? i - 1 : i + 1
      if (j >= 0 && j < arr.length) [arr[i], arr[j]] = [arr[j], arr[i]]
    },
    reorderCertifications(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      snapshot(state)
      state.data.certifications = arrayMove([...state.data.certifications], action.payload.fromIndex, action.payload.toIndex)
    },

    // ── Languages ─────────────────────────────────────────────────────────────
    addLanguage(state) {
      snapshot(state)
      state.data.languages.push({ id: crypto.randomUUID(), name: '', proficiency: 'Intermediate' })
    },
    updateLanguage(state, action: PayloadAction<{ id: string; changes: Partial<Language> }>) {
      snapshot(state)
      const item = state.data.languages.find((l) => l.id === action.payload.id)
      if (item) Object.assign(item, action.payload.changes)
    },
    removeLanguage(state, action: PayloadAction<string>) {
      snapshot(state)
      state.data.languages = state.data.languages.filter((l) => l.id !== action.payload)
    },
    moveLanguage(state, action: PayloadAction<{ id: string; direction: 'up' | 'down' }>) {
      snapshot(state)
      const { id, direction } = action.payload
      const arr = state.data.languages
      const i = arr.findIndex((l) => l.id === id)
      const j = direction === 'up' ? i - 1 : i + 1
      if (j >= 0 && j < arr.length) [arr[i], arr[j]] = [arr[j], arr[i]]
    },
    reorderLanguages(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      snapshot(state)
      state.data.languages = arrayMove([...state.data.languages], action.payload.fromIndex, action.payload.toIndex)
    },

    // ── Awards ────────────────────────────────────────────────────────────────
    addAward(state) {
      snapshot(state)
      state.data.awards.push({ id: crypto.randomUUID(), title: '', date: '', description: '' })
    },
    updateAward(state, action: PayloadAction<{ id: string; changes: Partial<Award> }>) {
      snapshot(state)
      const item = state.data.awards.find((a) => a.id === action.payload.id)
      if (item) Object.assign(item, action.payload.changes)
    },
    removeAward(state, action: PayloadAction<string>) {
      snapshot(state)
      state.data.awards = state.data.awards.filter((a) => a.id !== action.payload)
    },
    moveAward(state, action: PayloadAction<{ id: string; direction: 'up' | 'down' }>) {
      snapshot(state)
      const { id, direction } = action.payload
      const arr = state.data.awards
      const i = arr.findIndex((a) => a.id === id)
      const j = direction === 'up' ? i - 1 : i + 1
      if (j >= 0 && j < arr.length) [arr[i], arr[j]] = [arr[j], arr[i]]
    },
    duplicateAward(state, action: PayloadAction<string>) {
      snapshot(state)
      const item = state.data.awards.find((a) => a.id === action.payload)
      if (item) {
        const i = state.data.awards.indexOf(item)
        state.data.awards.splice(i + 1, 0, { ...current(item), id: crypto.randomUUID() })
      }
    },
    reorderAwards(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      snapshot(state)
      state.data.awards = arrayMove([...state.data.awards], action.payload.fromIndex, action.payload.toIndex)
    },

    // ── Volunteer ─────────────────────────────────────────────────────────────
    addVolunteer(state) {
      snapshot(state)
      state.data.volunteer.push({
        id: crypto.randomUUID(), organization: '', role: '', location: '',
        startDate: '', endDate: '', currentlyVolunteering: false, description: '',
      })
    },
    updateVolunteer(state, action: PayloadAction<{ id: string; changes: Partial<VolunteerWork> }>) {
      snapshot(state)
      const item = state.data.volunteer.find((v) => v.id === action.payload.id)
      if (item) Object.assign(item, action.payload.changes)
    },
    removeVolunteer(state, action: PayloadAction<string>) {
      snapshot(state)
      state.data.volunteer = state.data.volunteer.filter((v) => v.id !== action.payload)
    },
    reorderVolunteer(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      snapshot(state)
      state.data.volunteer = arrayMove([...state.data.volunteer], action.payload.fromIndex, action.payload.toIndex)
    },

    // ── Interests ─────────────────────────────────────────────────────────────
    addInterest(state, action: PayloadAction<string>) {
      snapshot(state)
      if (action.payload.trim()) state.data.interests.push(action.payload.trim())
    },
    removeInterest(state, action: PayloadAction<number>) {
      snapshot(state)
      state.data.interests.splice(action.payload, 1)
    },
    setInterests(state, action: PayloadAction<string[]>) {
      snapshot(state)
      state.data.interests = action.payload
    },

    // ── Custom Sections ───────────────────────────────────────────────────────
    addCustomSection(state) {
      snapshot(state)
      state.data.customSections.push({ id: crypto.randomUUID(), title: 'Custom Section', items: [] })
    },
    updateCustomSection(state, action: PayloadAction<{ id: string; changes: Partial<Pick<CustomSection, 'title'>> }>) {
      snapshot(state)
      const section = state.data.customSections.find((s) => s.id === action.payload.id)
      if (section) Object.assign(section, action.payload.changes)
    },
    removeCustomSection(state, action: PayloadAction<string>) {
      snapshot(state)
      state.data.customSections = state.data.customSections.filter((s) => s.id !== action.payload)
    },
    addCustomSectionItem(state, action: PayloadAction<string>) {
      snapshot(state)
      const section = state.data.customSections.find((s) => s.id === action.payload)
      if (section) section.items.push({ id: crypto.randomUUID(), subtitle: '', description: '' })
    },
    updateCustomSectionItem(state, action: PayloadAction<{ sectionId: string; itemId: string; changes: Partial<CustomSectionItem> }>) {
      snapshot(state)
      const section = state.data.customSections.find((s) => s.id === action.payload.sectionId)
      const item = section?.items.find((i) => i.id === action.payload.itemId)
      if (item) Object.assign(item, action.payload.changes)
    },
    removeCustomSectionItem(state, action: PayloadAction<{ sectionId: string; itemId: string }>) {
      snapshot(state)
      const section = state.data.customSections.find((s) => s.id === action.payload.sectionId)
      if (section) section.items = section.items.filter((i) => i.id !== action.payload.itemId)
    },

    // ── Global ────────────────────────────────────────────────────────────────
    loadResumeData(state, action: PayloadAction<ResumeData>) {
      state.past = []
      state.future = []
      state.data = action.payload
      state.lastSaved = new Date().toISOString()
    },
    loadSampleData(state) {
      state.past = []
      state.future = []
      state.data = sampleResumeData
      state.lastSaved = new Date().toISOString()
    },
    clearResume(state) {
      state.past = []
      state.future = []
      state.data = defaultResume
      state.lastSaved = null
    },
  },
})

export const {
  undo, redo, loadResumeData,
  updatePersonal,
  toggleSectionVisibility,
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
} = resumeSlice.actions

export default resumeSlice.reducer
