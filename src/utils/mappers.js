export const mapCaseIds = (data) => {
  return data.map((item) => ({
    id: item.case.id,
    status: item.case.status,
    createdAt: item.case.created_at,
    creator: item.user?.username || '-',
    assignedTeam: item.case.accepted_team_id,
    nearestTeams: item.sosRequests?.[0]?.nearest_team_ids?.join(', ') || '-',
  }));
};

export const mapSosRequests = (data) => {
  let sosList = [];
  data.forEach((item) => {
    item.sosRequests?.forEach((sos) => {
      sosList.push({
        id: sos.id,
        sender: item.user?.username || '-',
        location: `${sos.latitude}, ${sos.longitude}`,
        severity: '-',
        createdAt: sos.created_at,
      });
    });
  });
  return sosList;
};
