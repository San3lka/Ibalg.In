#!/usr/bin/env bash
# Usage: prep.sh S2_URL S3_URL  — downloads inputs into ./ad/media and builds the VO track.
set -euo pipefail
G=https://d8j0ntlcm91z4.cloudfront.net/user_3FMireS2IDcpsQnIdwAXfjpVWYo
R=https://raw.githubusercontent.com/San3lka/Ibalg.In/claude/serene-edison-tcx77w/ad-assets
mkdir -p ad/media ad/renders && cd ad
curl -sfo media/s1.mp4 $G/hf_20261001_153736_1a455eee-b818-4787-a824-3f20a4196bb9.mp4
curl -sfo media/s4.mp4 $G/hf_20261001_153737_9149e6e3-5cc6-4df5-a4ea-9f130ff594f6.mp4
curl -sfo media/s5.mp4 $G/hf_20261001_153736_5308f459-dccc-43c5-ae1b-c3af8ea5f902.mp4
curl -sfo media/vo.wav $G/hf_20261001_153739_67d8cbc6-2019-40d4-9cd5-2745028a609a.wav
curl -sfo media/s2.mp4 "$1"
curl -sfo media/s3.mp4 "$2"
curl -sfLo media/logo.png -A 'Mozilla/5.0' https://0api.tech/img/web-logo.png
curl -sfo media/mimo_card.png $R/s4_mimo_down_card.png
curl -sfo edit.jsx $R/edit.jsx
# S5: 4.04 s -> 4.6 s, motion-interpolated to 30 fps
ffmpeg -v error -y -i media/s5.mp4 -vf "setpts=1.14*PTS,minterpolate=fps=30:mi_mode=mci" -an media/s5_slow.mp4
# VO: cut sentences on their pauses and place each at its scene start
ffmpeg -v error -y -i media/vo.wav -filter_complex "\
[0]atrim=0.00:3.80,asetpts=PTS-STARTPTS,adelay=50:all=1[a];\
[0]atrim=4.25:7.10,asetpts=PTS-STARTPTS,adelay=3950:all=1[b];\
[0]atrim=7.35:9.10,asetpts=PTS-STARTPTS,adelay=7300:all=1[c];\
[0]atrim=9.50:10.15,asetpts=PTS-STARTPTS,adelay=10450:all=1[d];\
[0]atrim=10.30:12.45,asetpts=PTS-STARTPTS,adelay=11900:all=1[e];\
[0]atrim=12.70:16.46,asetpts=PTS-STARTPTS,adelay=14700:all=1[f];\
[a][b][c][d][e][f]amix=inputs=6:normalize=0,apad=whole_dur=19,atrim=0:19,loudnorm=I=-14:TP=-1.5:LRA=7[out]" \
 -map "[out]" -ar 48000 -ac 2 media/vo_track.wav
echo PREP_OK
