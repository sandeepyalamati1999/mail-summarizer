function TicketsPayload() {
  return {
    getPostTickets(tickets) {
      let {
        name,
        created,
        updated,
        ticketId,
        subject,
        description,
        priority,
        status,
        category,
        dateOfIssue,
        dateOfSubmission,
        resolutionDate,
      } = tickets.getfields();
      return {
        name,
        created,
        updated,
        ticketId,
        subject,
        description,
        priority,
        status,
        category,
        dateOfIssue,
        dateOfSubmission,
        resolutionDate,
      };
    },
  };
}

export default TicketsPayload;
