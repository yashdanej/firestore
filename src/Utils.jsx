export const changeText = (e, set, content, value) => {
    set({...content, [e.target.name]: value?value:e.target.value})
}