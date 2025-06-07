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
        nearest_team_ids: sos.nearest_team_ids?.join(', ') || '-',
        createdAt: sos.created_at,
        case_id: item.case.id,
      });
    });
  });
  return sosList;
};

export const createMapMarkers = (rescueTeamLocations) => {
  return rescueTeamLocations.data.map((team) => ({
    position: [parseFloat(team.latitude), parseFloat(team.longitude)],
    popup: team.name,
    status: team.status,
    color:
      team.status === 'available'
        ? 'green'
        : team.status === 'busy'
          ? 'red'
          : team.status === 'rescuing'
            ? 'orange'
            : 'gray',
  }));
};

export const createCaseMarkers = (data) => {
  let caseMarkers = [];

  data.forEach((item) => {
    item.sosRequests?.forEach((sos) => {
      const caseStatus = item.case.status;

      if (
        caseStatus === 'pending' ||
        caseStatus === 'accepted' ||
        caseStatus === 'ready'
      ) {
        caseMarkers.push({
          position: [parseFloat(sos.latitude), parseFloat(sos.longitude)],
          popup: `Status: ${caseStatus} | Created: ${new Date(sos.created_at).toLocaleString()}`,
          caseId: item.case.id,
          status: caseStatus,
          type: 'case',
          createdAt: sos.created_at,
          sender: item.user?.username || 'Unknown',
        });
      }
    });
  });

  return caseMarkers;
};

export const createTeamMarkers = (teams) => {
  return teams.map((team) => ({
    position: [parseFloat(team.latitude), parseFloat(team.longitude)],
    popup: `Status: ${team.status} | Phone: ${team.phone_number || 'N/A'}`,
    teamId: team.user_id,
    status: team.status,
    type: 'team',
    teamName: team.team_name,
    phone: team.phone_number,
  }));
};
