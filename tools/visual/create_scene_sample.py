"""Editable, procedural M2 blocking scene. Run with the project Blender wrapper."""
import argparse
import bpy
import json
import math
import random
import sys
import time
from pathlib import Path
from mathutils import Vector

parser = argparse.ArgumentParser()
parser.add_argument('--output', default='design/production/m2-v1')
parser.add_argument('--render-animation', action='store_true')
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
root = Path(__file__).resolve().parents[2]
out = (root / args.output).resolve()
if not out.is_relative_to(root):
    raise ValueError('Sample output must remain inside this project.')
out.mkdir(parents=True, exist_ok=True)
random.seed(41)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.eevee.taa_render_samples = 16
scene.render.resolution_x = 960
scene.render.resolution_y = 600
scene.render.resolution_percentage = 100
scene.render.fps = 12
scene.frame_start, scene.frame_end = 1, 72
scene.world.color = (.055, .037, .09)
scene.view_settings.view_transform = 'AgX'

def material(name, color, metallic=0, roughness=.65, emission=0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = roughness
    p.inputs['Metallic'].default_value = metallic
    if emission:
        p.inputs['Emission Color'].default_value = (*color, 1)
        p.inputs['Emission Strength'].default_value = emission
    return m

plum = material('Plum painted timber', (.19, .055, .24))
copper = material('Warm copper', (.55, .21, .06), .4)
cream = material('Warm plaster', (.63, .5, .32))
wood = material('Dark wood', (.13, .067, .043))
teal = material('Muted turquoise', (.035, .2, .2))
roof = material('Blue slate', (.065, .08, .12))
gold = material('Amber window light', (1, .47, .09), emission=2)
magic = material('Soft magic light', (.12, .75, .58), emission=3)
feather = material('Owl ivory', (.75, .67, .48))
dark = material('Owl eyes', (.012, .012, .018), roughness=.22)
cobble_mats = [material('Cobble '+str(i), (.12+i*.018, .105+i*.013, .11+i*.014), roughness=.38) for i in range(5)]

def finish(o, name, mat, parent=None):
    o.name = name
    o.data.materials.append(mat)
    if parent:
        o.parent = parent
    return o

def cube(name, loc, scale, mat, bevel=0, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = o.modifiers.new('Rounded craftsmanship', 'BEVEL')
        mod.width, mod.segments = bevel, 2
        o.modifiers.new('Weighted edges', 'WEIGHTED_NORMAL')
    return finish(o, name, mat, parent)

def sphere(name, loc, scale, mat, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=1, location=loc)
    o = bpy.context.object
    o.scale = scale
    for f in o.data.polygons:
        f.use_smooth = True
    return finish(o, name, mat, parent)

def cone(name, loc, radius, depth, mat, parent=None):
    bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=radius, radius2=.03, depth=depth, location=loc)
    return finish(bpy.context.object, name, mat, parent)

def empty(name, loc):
    o = bpy.data.objects.new(name, None)
    scene.collection.objects.link(o)
    o.location = loc
    return o

def point(name, loc, energy, color, radius=.5):
    data = bpy.data.lights.new(name, 'POINT')
    data.energy, data.color, data.shadow_soft_size = energy, color, radius
    o = bpy.data.objects.new(name, data)
    scene.collection.objects.link(o)
    o.location = loc
    return o

cube('Alley foundation', (0, 7, -.15), (12, 50, .25), cobble_mats[0])
for row in range(66):
    for col in range(14):
        x = -4.15 + col*.62 + (row%2)*.26
        y = -12 + row*.59
        cube('Cobble', (x, y, .02+random.random()*.025), (.57, .52, .11), random.choice(cobble_mats), .04)

for side in [-1, 1]:
    for i in range(7):
        y = i*4.6
        is_weasley = side == 1 and i == 2
        height = 8.4 if is_weasley else random.uniform(6.3, 9.3)
        wall_mat = plum if is_weasley else [cream, teal, wood][i%3]
        cube('Weasley facade' if is_weasley else 'Unavailable background facade', (side*5.6,y,height/2), (3.1,4.5,height), wall_mat, .12)
        cube('Cornice', (side*4.0,y,height-.35), (.27,4.55,.22), copper, .04)
        for floor in range(3):
            z = 1.75+floor*2.15
            for offset in [-1.25, 0, 1.25]:
                cube('Window frame', (side*3.99,y+offset,z), (.14,.95,1.55), wood, .07)
                cube('Warm window', (side*3.9,y+offset,z), (.07,.77,1.32), gold, .04)
                cube('Window mullion', (side*3.84,y+offset,z), (.09,.055,1.4), copper)
                cube('Window crossbar', (side*3.82,y+offset,z), (.09,.84,.05), copper)
        cube('Slate roof', (side*5.6,y,height+.25), (3.7,4.8,.4), roof, .06)
        cube('Chimney', (side*6.1,y+1,height+1), (.5,.55,1.45), copper, .04)
        if is_weasley:
            cube('Weasley doorway', (3.8,y,1.5), (.25,1.15,2.8), wood, .12)
            cube('Door inner panel', (3.64,y,1.45), (.08,.94,2.35), copper, .07)
            for z in [.5,2.5,4.5,6.5]:
                cube('Weasley golden band', (3.76,y,z), (.16,4.3,.13), copper, .025)
            cone('Playful facade hat', (3.55,y,7.45), .62, 1.5, copper)
            sphere('Hat star', (3.54,y,8.4), (.14,.14,.14), gold)
        # Lanterns and warm spill are real separate objects, not painted windows.
        cube('Lantern arm', (side*3.5,y-1.85,3.2), (1,.07,.07), wood)
        cube('Lantern cage', (side*3.05,y-1.85,2.96), (.32,.32,.5), copper, .04)
        cube('Lantern glow', (side*3.05,y-1.85,2.96), (.25,.25,.39), gold, .03)
        point('Lantern spill', (side*2.9,y-1.85,2.9), 70, (1,.48,.18))

# Meshes parented to pivots: articulated blocking subjects, not final skeletal rigs.
owl = empty('Owl flight root', (-2,3,5))
sphere('Owl body',(0,0,0),(.26,.4,.32),feather,owl)
sphere('Owl head',(0,-.27,.13),(.3,.22,.3),feather,owl)
for sign in [-1,1]:
    sphere('Owl eye',(sign*.11,-.46,.17),(.075,.04,.075),dark,owl)
    wing = empty('Owl wing pivot '+str(sign), (sign*.18,0,.05))
    wing.parent = owl
    sphere('Owl wing',(sign*.47,.03,0),(.6,.25,.045),feather,wing)
    for frame in range(1,73,3):
        wing.rotation_euler.y = sign*(.52*math.sin(frame*.55))
        wing.keyframe_insert(data_path='rotation_euler',frame=frame)
cone('Owl beak',(0,-.49,.07),.065,.13,copper,owl)
for frame in range(1,73):
    t=(frame-1)/71
    owl.location=(-3.2+6.4*t,7.2+1.2*math.sin(t*math.pi),4.8+.32*math.sin(t*2*math.pi))
    owl.rotation_euler.z = -.2+.4*t
    owl.keyframe_insert(data_path='location',frame=frame)
    owl.keyframe_insert(data_path='rotation_euler',frame=frame)

walker=empty('Mage walk root',(-1.4,7,.0))
cone('Mage robe',(0,0,1.0),.34,1.15,plum,walker)
sphere('Mage head',(0,0,1.81),(.19,.18,.22),cream,walker)
cone('Mage hat',(0,0,2.1),.29,.47,teal,walker)
for sign in [-1,1]:
    leg=empty('Mage leg pivot '+str(sign),(sign*.12,0,.64));leg.parent=walker
    cube('Mage trouser',(0,0,-.24),(.14,.16,.48),wood,.025,leg)
    cube('Mage shoe',(0,-.045,-.5),(.18,.3,.14),wood,.04,leg)
    arm=empty('Mage arm pivot '+str(sign),(sign*.3,0,1.38));arm.parent=walker
    sphere('Mage sleeve',(0,0,-.25),(.11,.1,.3),plum,arm)
    for frame in range(1,73):
        phase=2*math.pi*(frame-1)/12
        leg.rotation_euler.x=sign*.3*math.sin(phase)
        arm.rotation_euler.x=-sign*.22*math.sin(phase)
        leg.keyframe_insert(data_path='rotation_euler',frame=frame)
        arm.keyframe_insert(data_path='rotation_euler',frame=frame)
for frame in range(1,73):
    walker.location=(-1.2,7+(frame-1)*.034,.035*abs(math.sin((frame-1)*math.pi/6)))
    walker.keyframe_insert(data_path='location',frame=frame)

for n in range(28):
    particle=sphere('Ambient spell mote', (0,0,0),(.028,)*3,magic)
    for frame in [1,18,36,54,72]:
        a=n*.25+frame*.05
        particle.location=(2.6+.45*math.cos(a),9+.35*math.sin(a),2+n*.035+.15*math.sin(a*2))
        particle.keyframe_insert(data_path='location',frame=frame)

key=bpy.data.lights.new('Warm theatrical key','AREA');key.energy=1500;key.color=(1,.73,.45);key.shape='DISK';key.size=12
key_obj=bpy.data.objects.new('Warm theatrical key',key);scene.collection.objects.link(key_obj);key_obj.location=(0,3,12)
fill=bpy.data.lights.new('Blue dusk fill','AREA');fill.energy=1100;fill.color=(.38,.49,1);fill.size=15
fill_obj=bpy.data.objects.new('Blue dusk fill',fill);scene.collection.objects.link(fill_obj);fill_obj.location=(0,-6,9)

bpy.ops.object.camera_add(location=(0,-10,2.6))
camera=bpy.context.object;camera.name='Guided visitor camera';camera.data.lens=24;scene.camera=camera
for frame in range(1,73):
    t=(frame-1)/71;s=t*t*(3-2*t)
    camera.location=(.25+s*.65,-10+s*12,2.7)
    target=Vector((1.7+1.0*s,10,3.5))
    camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.keyframe_insert(data_path='location',frame=frame)
    camera.keyframe_insert(data_path='rotation_euler',frame=frame)

# Small soft bloom; no text, flashes, audio or game reward in the render.
scene.use_nodes=True
nodes=scene.node_tree.nodes;nodes.clear()
layers=nodes.new('CompositorNodeRLayers')
glare=nodes.new('CompositorNodeGlare');glare.glare_type='FOG_GLOW';glare.quality='LOW';glare.threshold=1.4
composite=nodes.new('CompositorNodeComposite')
scene.node_tree.links.new(layers.outputs['Image'],glare.inputs['Image'])
scene.node_tree.links.new(glare.outputs['Image'],composite.inputs['Image'])
scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=str(out/'callejon-m2.blend'))
bpy.ops.export_scene.gltf(filepath=str(out/'callejon-m2.glb'),export_format='GLB',export_animations=True,export_cameras=True,export_lights=True)
started=time.monotonic()
for frame,label in [(1,'entry'),(36,'middle'),(72,'weasley')]:
    scene.frame_set(frame)
    scene.render.image_settings.file_format='PNG'
    scene.render.filepath=str(out/f'{label}.png')
    bpy.ops.render.render(write_still=True)
elapsed=time.monotonic()-started
manifest={'id':'M2-GEOMETRY-V01','state':'provisional procedural spatial/articulation blocking; not approved final artwork',
          'tool':'Blender '+bpy.app.version_string,'author':'Codex-authored local bpy geometry; no generative API',
          'cash_cost':0,'paid_services':[], 'reference':'A11/A12 palette and A20 visit direction; originals unmodified',
          'source':'callejon-m2.blend','script':'tools/visual/create_scene_sample.py','export':'callejon-m2.glb',
          'posters':['entry.png','middle.png','weasley.png'],'dimensions':[960,600],'fps':12,'frames':72,
          'engine':scene.render.engine,'poster_render_seconds':round(elapsed,2),'object_count':len(scene.objects),
          'articulation':'parented wing/leg/arm mesh pivots with keyframes; no skeletal armature',
          'camera':'real perspective camera moving through geometry; fixed scripted path, not user-controlled yet',
          'license':'Blender GPL for software; procedural source in this repo; Harry Potter usage authorization unestablished',
          'functional_text':'none in render; ES/EN labels belong to preview DOM',
          'missing':['final illustrated finish','anatomically refined owl and walk cycle/foot locking','shop interior','articulated frog reveal','interactive camera controls','GPU/device/accessibility integration tests'],
          'assets':[{'id':'A20-V01','actual':'procedural alley/Weasley blocking, same .blend','final_required':'A12 detailed illustrated finish and mobile composition'},
                    {'id':'A20-V02','actual':'articulated oval meshes and wing pivots','final_required':'refined owl anatomy/flight poses'},
                    {'id':'A20-V03','actual':'simple robed mage and limb pivots','final_required':'refined walk cycle/foot contact'},
                    {'id':'A20-V04','actual':'lamp meshes/lights and keyframed spell motes','final_required':'directed environmental effects'}]}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
if args.render_animation:
    scene.render.resolution_percentage=50
    scene.render.image_settings.file_format='FFMPEG'
    scene.render.ffmpeg.format='MPEG4'
    scene.render.ffmpeg.codec='H264'
    scene.render.ffmpeg.constant_rate_factor='MEDIUM'
    scene.render.filepath=str(out/'walkthrough-preview.mp4')
    bpy.ops.render.render(animation=True)
print('M2_LOCAL_SAMPLE_READY',str(out),flush=True)
