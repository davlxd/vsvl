const initialState = {
  progressList: [],
}


export default (state = initialState, action) => {
  switch(action.type) {
    case 'NEW_FFMPEG_WORK':
      return {
        ...state,
        progressList: [
          ...state.progressList,
          {
            id: action.id,
            percentage: 0.0
          },
        ]
      }
    case 'FFMPEG_WORK_FINISHED':
      return {
        ...state,
        progressList: state.progressList.filter(item => action.id !== item.id)
      }
    case 'FFMPEG_WORK_UPDATE_PROGRESS':
      return {
        ...state,
        progressList: state.progressList.map(item => {
          if (item.id !== action.id) {
            return item
          }
          return {
            ...item,
            percentage: action.percentage
          }
        })
      }
    default:
      return state
  }
}
