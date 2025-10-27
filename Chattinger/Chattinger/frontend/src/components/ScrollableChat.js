const ScrollableChat = ({ messages, userId }) => (
  <Box>
    {messages &&
      messages.map((m, i) => (
        <div style={{ display: "flex" }} key={m._id}>
          {isSameSender(messages, m, i, userId)}
          )}
          <span>{m.content}</span>
        </div>
      ))}
  </Box>
);
