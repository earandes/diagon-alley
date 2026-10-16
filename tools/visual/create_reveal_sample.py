"""Provisional articulated frog-box reveal: editable geometry, no game reward."""
import bpy
import json
import math
from pathlib import Path
from mathutils import Vector

root=Path(__file__).resolve().parents[2]
out=root/'design/production/reveal-v1'
out.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE_NEXT';scene.eevee.taa_render_samples=16
scene.render.resolution_x=960;scene.render.resolution_y=600;scene.render.resolution_percentage=100
scene.render.fps=12;scene.frame_start=1;scene.frame_end=48
scene.world.color=(.025,.018,.045);scene.view_settings.view_transform='AgX'

def mat(name,color,emission=0):
    m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=.4
    if emission:p.inputs['Emission Color'].default_value=(*color,1);p.inputs['Emission Strength'].default_value=emission
    return m

plum=mat('Plum cardboard',(.19,.045,.25));copper=mat('Copper ornament',(.65,.28,.07))
cream=mat('Sample card face',(.85,.73,.47));chocolate=mat('Chocolate',(.15,.048,.021))
light=mat('Gentle magic',(.32,.72,.48),3);wood=mat('Counter',(.11,.051,.027));dark=mat('Eyes',(.014,.008,.004))

def apply(o,name,material,parent=None):
    o.name=name;o.data.materials.append(material)
    if parent:o.parent=parent
    return o

def cube(name,loc,scale,material,parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.scale=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    b=o.modifiers.new('Soft edges','BEVEL');b.width=.025;b.segments=3
    return apply(o,name,material,parent)

def sphere(name,loc,scale,material,parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,location=loc);o=bpy.context.object;o.scale=scale
    for p in o.data.polygons:p.use_smooth=True
    return apply(o,name,material,parent)

def empty(name,loc):
    o=bpy.data.objects.new(name,None);scene.collection.objects.link(o);o.location=loc;return o

cube('Wooden counter',(0,0,-.25),(7,5,.4),wood)
# Five walls and bottom leave a real opening, with an independent inner lining.
verts=[]
for z,r in [(0,.82),(.35,.82),(.35,.73),(0,.73)]:
    for i in range(5):
        a=2*math.pi*i/5+math.pi/2;verts.append((r*math.cos(a),r*math.sin(a),z))
faces=[]
for band in range(3):
    for i in range(5):faces.append((band*5+i,band*5+(i+1)%5,(band+1)*5+(i+1)%5,(band+1)*5+i))
mesh=bpy.data.meshes.new('Pentagonal hollow base');mesh.from_pydata(verts,[],faces);mesh.update()
base=bpy.data.objects.new('Box base',mesh);scene.collection.objects.link(base);base.data.materials.append(plum)
bpy.ops.mesh.primitive_cylinder_add(vertices=5,radius=.73,depth=.035,location=(0,0,.018))
apply(bpy.context.object,'Interior lining',copper)
lid=empty('Lid hinge',(0,.66,.35))
bpy.ops.mesh.primitive_cylinder_add(vertices=5,radius=.84,depth=.09,location=(0,-.66,.045))
apply(bpy.context.object,'Separate pentagonal lid',plum,lid)
bpy.ops.mesh.primitive_torus_add(major_radius=.55,minor_radius=.025,major_segments=40,minor_segments=8,location=(0,-.66,.1))
apply(bpy.context.object,'Lid ornament',copper,lid)
for frame,angle in [(1,0),(7,0),(19,-1.9),(48,-1.9)]:
    lid.rotation_euler.x=angle;lid.keyframe_insert(data_path='rotation_euler',frame=frame)

frog=empty('Frog jump root',(0,0,.13))
sphere('Frog body',(0,0,0),(.3,.36,.16),chocolate,frog)
sphere('Frog head',(0,-.25,.08),(.29,.2,.15),chocolate,frog)
for side in [-1,1]:
    sphere('Frog eye mound',(side*.18,-.28,.19),(.07,.07,.075),chocolate,frog)
    sphere('Frog eye',(side*.18,-.34,.2),(.035,.025,.035),dark,frog)
    for y in [-.17,.2]:
        joint=empty('Frog leg pivot',(side*.21,y,0));joint.parent=frog
        sphere('Chocolate leg',(side*.1,0,-.04),(.15,.1,.06),chocolate,joint)
        sphere('Chocolate foot',(side*.2,-.07,-.08),(.12,.12,.025),chocolate,joint)
        for frame,angle in [(1,0),(15,-side*.4),(20,side*.45),(30,0),(48,0)]:
            joint.rotation_euler.y=angle;joint.keyframe_insert(data_path='rotation_euler',frame=frame)
for frame,loc,scale in [(1,(0,0,.12),(1,1,1)),(13,(0,0,.15),(1.1,1.1,.8)),(20,(.1,-.1,1.45),(1,1,1)),(30,(1.9,-.2,.25),(1,1,1)),(48,(1.9,-.2,.25),(1,1,1))]:
    frog.location=loc;frog.scale=scale;frog.keyframe_insert(data_path='location',frame=frame);frog.keyframe_insert(data_path='scale',frame=frame)

card=empty('Sample card root',(0,.1,-1))
cube('Card paper',(0,0,0),(.85,.04,1.2),cream,card)
for x in [-.4,.4]:cube('Card border',(x,-.031,0),(.025,.025,1.12),copper,card)
for z in [-.55,.55]:cube('Card border',(0,-.031,z),(.8,.025,.025),copper,card)
# No portrait, name, rarity, or stats: a known scripted sample, not a reward.
for frame,z,turn in [(1,-1,math.pi),(21,-1,math.pi),(30,1.0,math.pi),(40,1.15,0),(48,1.05,0)]:
    card.location.z=z;card.rotation_euler.z=turn
    card.keyframe_insert(data_path='location',frame=frame);card.keyframe_insert(data_path='rotation_euler',frame=frame)
for n in range(28):
    mote=sphere('Reveal light mote',(0,0,0),(.023,)*3,light)
    for frame in [1,10,20,30,40,48]:
        progress=max(0,(frame-10)/38);a=n*.43+progress*5
        mote.location=((.55+progress*.2)*math.cos(a),(.55+progress*.2)*math.sin(a),.1+progress*(.8+n*.025))
        mote.scale=(0,0,0) if frame<10 else ((.023,.023,.023) if frame<40 else (.00345,.00345,.00345))
        mote.keyframe_insert(data_path='location',frame=frame);mote.keyframe_insert(data_path='scale',frame=frame)
for name,loc,energy,color,size in [('Warm key',(-3,-3,5),850,(1,.67,.36),4),('Plum rim',(2,3,4),1000,(.5,.35,1),3)]:
    data=bpy.data.lights.new(name,'AREA');data.energy=energy;data.color=color;data.size=size
    o=bpy.data.objects.new(name,data);scene.collection.objects.link(o);o.location=loc
    o.rotation_euler=(Vector((0,0,.5))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(3.4,-5.8,3.2));cam=bpy.context.object;cam.data.lens=43
cam.rotation_euler=(Vector((.4,0,.65))-cam.location).to_track_quat('-Z','Y').to_euler();scene.camera=cam
scene.use_nodes=True;nodes=scene.node_tree.nodes;nodes.clear()
layers=nodes.new('CompositorNodeRLayers');glare=nodes.new('CompositorNodeGlare');glare.glare_type='FOG_GLOW';glare.threshold=1.5
composite=nodes.new('CompositorNodeComposite');scene.node_tree.links.new(layers.outputs['Image'],glare.inputs['Image']);scene.node_tree.links.new(glare.outputs['Image'],composite.inputs['Image'])
scene.frame_set(1);bpy.ops.wm.save_as_mainfile(filepath=str(out/'reveal-m2.blend'))
for frame,label in [(1,'closed'),(24,'magic'),(48,'sample-result')]:
    scene.frame_set(frame);scene.render.image_settings.file_format='PNG';scene.render.filepath=str(out/(label+'.png'));bpy.ops.render.render(write_still=True)
manifest={'id':'M2-REVEAL-V01','state':'procedural articulation blocking; final art not approved','cash_cost':0,
          'tool':'Blender '+bpy.app.version_string,'author':'Codex native procedural geometry','source':'reveal-m2.blend',
          'script':'tools/visual/create_reveal_sample.py','frames':48,'fps':12,'dimensions':[960,600],
          'parts':['hollow base','inner lining','separate lid and hinge','frog body and leg pivots','sample card and borders','light motes'],
          'articulation':'keyframed object pivots; not a skeletal armature','reward':'none: blank sample card, no identity or rarity',
          'functional_text':'external DOM es/en; none in bitmap',
          'permissions':'Harry Potter usage not established; private preparation only',
          'missing':['A12 detailed artwork','refined frog anatomy/poses','real result data integration','skip/reduced-motion in application']}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('LOCAL_REVEAL_SOURCE_READY',out,flush=True)
