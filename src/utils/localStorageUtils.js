export const saveCardsToLocal = (cards) => {
  localStorage.setItem('carpetCards', JSON.stringify(cards));
};

export const loadCardsFromLocal = () => {
  const saved = localStorage.getItem('carpetCards');
  return saved ? JSON.parse(saved) : [];
};
