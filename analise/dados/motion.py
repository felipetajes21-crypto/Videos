import cv2, numpy as np, sys, csv, math
vid, out = sys.argv[1], sys.argv[2]
cap = cv2.VideoCapture(vid)
prev=None; rows=[]; i=0
while True:
    ok, f = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(f,(270,480)), cv2.COLOR_BGR2GRAY)
    sharp = cv2.Laplacian(g, cv2.CV_64F).var()
    bright = g.mean()
    s=1;rot=0;tx=0;ty=0;inl=0;diff=0;npts=0
    if prev is not None:
        diff = float(np.abs(g.astype(int)-prev.astype(int)).mean())
        p0 = cv2.goodFeaturesToTrack(prev, 300, 0.01, 6)
        if p0 is not None and len(p0)>=8:
            p1, st, err = cv2.calcOpticalFlowPyrLK(prev, g, p0, None, winSize=(21,21), maxLevel=3)
            good = st.ravel()==1
            a,b = p0[good], p1[good]; npts=len(a)
            if len(a)>=8:
                M, mask = cv2.estimateAffinePartial2D(a,b,method=cv2.RANSAC, ransacReprojThreshold=1.5)
                if M is not None:
                    s = math.hypot(M[0,0],M[1,0]); rot=math.degrees(math.atan2(M[1,0],M[0,0]))
                    # translation of centre point
                    c = np.array([135,240,1.0]); cc = M@c
                    tx,ty = (cc[0]-135)*4, (cc[1]-240)*4   # in 1080p px
                    inl = float(mask.mean())
    rows.append(dict(f=i,t=round(i/30,3),diff=round(diff,2),sharp=round(sharp,1),bright=round(bright,1),scale=round(s,4),rot=round(rot,3),tx=round(tx,1),ty=round(ty,1),inl=round(inl,2),pts=npts))
    prev=g; i+=1
with open(out,'w',newline='') as fh:
    w=csv.DictWriter(fh,fieldnames=rows[0].keys()); w.writeheader(); w.writerows(rows)
print(vid, i, 'frames')
