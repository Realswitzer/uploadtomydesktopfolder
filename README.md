literally just a way to upload silly shit to my desktop folder

usage
```sh
# File upload
curl -X PUT \
  -H "Authorization: $AUTH" \
  -F 'file=@./file.txt' \
  http://localhost:3001/file

# Text upload, autogen file name
curl -X POST \
  -H 'Content-Type: text/plain' \
  -H 'Authorization: $AUTH' \
  -d 'text' \
  http://localhost:3001/text

# Text upload, custom file name
curl -X POST \
  -H 'Content-Type: text/plain' \
  -H 'Authorization: $AUTH' \
  -d 'text' \
  http://localhost:3001/text/name

# Upload text contents, autogen file name
curl -X POST \
  -H 'Content-Type: text/plain' \
  -H 'Authorization: $AUTH' \
  -data '@file.txt' \
  http://localhost:3001/text
```

awesome