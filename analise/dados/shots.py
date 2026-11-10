import csv, sys, math
for v in (1,2,3):
    R=list(csv.DictReader(open(f"v{v}/motion.csv")))
    for r in R:
        for k in r: r[k]=float(r[k])
    # cut = big diff spike + low inlier ratio
    cuts=[0]
    for i,r in enumerate(R[1:],1):
        if r['diff']>22 and r['inl']<0.5 and i-cuts[-1]>8: cuts.append(i)
    cuts.append(len(R))
    print(f"\n=== V{v}: {len(cuts)-2} cortes duros, duração média de plano {len(R)/(len(cuts)-1)/30:.2f}s")
    print(" plano  início  dur   zoom_acum  zoom/s   desloc_x  desloc_y  rot   nitidez_min")
    for a,b in zip(cuts[:-1],cuts[1:]):
        seg=[r for r in R[a+1:b] if r['inl']>0.6 and r['pts']>30]
        z=1;tx=ty=rot=0
        for r in seg:
            if 0.9<r['scale']<1.1: z*=r['scale']; tx+=r['tx']; ty+=r['ty']; rot+=r['rot']
        d=(b-a)/30
        print(f" {cuts.index(a)+1:>4}  {a/30:6.2f}  {d:4.2f}  {z:8.3f}  {((z**(1/d))-1)*100 if d>0 else 0:6.1f}%  {tx:8.0f}  {ty:8.0f}  {rot:5.1f}  {min(r['sharp'] for r in R[a:b]):8.0f}")
