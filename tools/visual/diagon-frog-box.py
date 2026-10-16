"""Author a local, genuinely separated pentagonal confectionery prop.

Run with tools/visual/blender.sh --background --factory-startup --python this.py.
No image generation service, external textures, paid exports or reward logic.
"""
import bpy
import math
import random
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'design/diagon-alley/sources/frog-box'
OUT.mkdir(parents=True, exist_ok=True)
random.seed(57)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.eevee.taa_render_samples = 48
scene.render.resolution_x = 768
scene.render.resolution_y = 768
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.film_transparent = True
scene.world.color = (.12, .10, .16)
scene.view_settings.view_transform = 'AgX'

def material(name, color, metallic=0, roughness=.35, noise=False):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    n = m.node_tree.nodes
    p = n.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Metallic'].default_value = metallic
    p.inputs['Roughness'].default_value = roughness
    if noise:
        t = n.new('ShaderNodeTexNoise')
        t.inputs['Scale'].default_value = 95
        b = n.new('ShaderNodeBump')
        b.inputs['Strength'].default_value = .2
        b.inputs['Distance'].default_value = .025
        m.node_tree.links.new(t.outputs['Fac'], b.inputs['Height'])
        m.node_tree.links.new(b.outputs['Normal'], p.inputs['Normal'])
    return m

purple = material('Violet crushed velvet paper', (.065, .009, .12), .12, .48, True)
gold = material('Antique embossed gold foil', (.8, .4, .085), .72, .28, True)
cream = material('Honey coloured interior silk', (.7, .43, .18), .05, .58, True)
inside = material('Plum inner cardboard', (.045, .01, .075), 0, .65)
objects = {'base': [], 'interior': [], 'lid': [], 'seal': []}
group = 'base'

def finish(o, name, mat):
    o.name = name
    o.data.materials.append(mat)
    objects[group].append(o)
    bevel = o.modifiers.new('Crafted softened edges', 'BEVEL')
    bevel.width = .015
    bevel.segments = 3
    return o

def mesh(name, vertices, faces, mat):
    data = bpy.data.meshes.new(name)
    data.from_pydata(vertices, [], faces)
    data.update()
    o = bpy.data.objects.new(name, data)
    scene.collection.objects.link(o)
    return finish(o, name, mat)

def cylinder(name, radius, depth, z, mat, sides=5):
    points = [(radius*math.cos(math.pi/2+i*math.tau/sides),
               radius*math.sin(math.pi/2+i*math.tau/sides), height)
              for height in [z-depth/2,z+depth/2] for i in range(sides)]
    faces = [tuple(reversed(range(sides))),tuple(range(sides,sides*2))]
    faces += [(i,(i+1)%sides,(i+1)%sides+sides,i+sides) for i in range(sides)]
    return mesh(name, points, faces, mat)

def curve(name, points, mat, thickness=.012, closed=False):
    data = bpy.data.curves.new(name, 'CURVE')
    data.dimensions = '3D'
    data.bevel_depth = thickness
    data.bevel_resolution = 3
    spline = data.splines.new('POLY')
    spline.points.add(len(points)-1)
    for p, co in zip(spline.points, points):
        p.co = (*co, 1)
    spline.use_cyclic_u = closed
    o = bpy.data.objects.new(name, data)
    scene.collection.objects.link(o)
    o.data.materials.append(mat)
    objects[group].append(o)
    return o

def polygon(radius, z):
    return [(radius*math.cos(math.pi/2+i*math.tau/5),
             radius*math.sin(math.pi/2+i*math.tau/5), z) for i in range(5)]

def star(cx, cy, radius, z, rays=8):
    vertices = [(cx, cy, z)]
    for i in range(rays*2):
        a = math.pi/2 + i*math.pi/rays
        r = radius if i%2 == 0 else radius*.32
        vertices.append((cx+math.cos(a)*r, cy+math.sin(a)*r, z))
    faces = [(0, i+1, (i+1)%(rays*2)+1) for i in range(rays*2)]
    return mesh('Embossed celestial star', vertices, faces, gold)

# Real hollow pentagon: outer / upper rim / inner walls and bottom.
vertices = polygon(1.2, .04)+polygon(1.2, .4)+polygon(1.12, .4)+polygon(1.12, .09)
faces = []
for band in range(3):
    for i in range(5):
        faces.append((band*5+i, band*5+(i+1)%5, (band+1)*5+(i+1)%5, (band+1)*5+i))
mesh('Hollow pentagonal confectionery box', vertices, faces, purple)
cylinder('Box underside', 1.12, .07, .055, purple)
for z in [.06, .36, .405]:
    curve('Golden pentagonal edge', polygon(1.205, z), gold, .017, True)
for x, y, _ in polygon(1.205, .05):
    curve('Gold corner seam', [(x, y, .05), (x, y, .405)], gold, .014)
for i in range(5):
    a = math.pi/2+(i+.5)*math.tau/5
    normal = Vector((math.cos(a),math.sin(a),0))
    tangent = Vector((-math.sin(a),math.cos(a),0))
    center = normal*(1.2*math.cos(math.pi/5)+.012)+Vector((0,0,.235))
    points = []
    for step in range(100):
        t = step/99
        p = center+tangent*((t-.5)*1.15)+Vector((0,0,.055*math.sin(t*math.tau*2)))
        points.append(tuple(p))
    curve('Side wall gold scrollwork',points,gold,.008)
    vertices = [tuple(center)]
    for step in range(16):
        angle=step*math.pi/8
        radius=.105 if step%2==0 else .03
        vertices.append(tuple(center+tangent*(math.cos(angle)*radius)+Vector((0,0,math.sin(angle)*radius))))
    mesh('Side wall celestial medallion',vertices,[(0,j+1,(j+1)%16+1) for j in range(16)],gold)
group = 'interior'
cylinder('Pentagonal inner silk lining', 1.115, .016, .103, cream)
curve('Gold interior inset', polygon(.99, .115), gold, .008, True)
star(0, 0, .4, .12, 8)
group = 'lid'
cylinder('Separate pentagonal lid', 1.245, .11, .465, purple)
for r, z in [(1.25, .425), (1.25, .52), (1.16, .525), (1.10, .526)]:
    curve('Raised gold lid border', polygon(r, z), gold, .014, True)
star(0, 0, .47, .53, 8)
for i in range(5):
    a = math.pi/2+i*math.tau/5
    x, y = .87*math.cos(a), .87*math.sin(a)
    star(x, y, .115, .53, 6)
    points = []
    for step in range(50):
        t = step/49
        spin = a+t*math.tau*1.3
        rad = .02+.17*t
        points.append((x+rad*math.cos(spin), y+rad*math.sin(spin), .53))
    curve('Handcrafted spiral filigree', points, gold, .007)
for i in range(25):
    a = i*math.tau/25
    star(.62*math.cos(a), .62*math.sin(a), .018 if i%2 else .026, .53, 4)

group = 'seal'
cylinder('Indigo wax seal', .19, .045, .56, purple, 40)
star(0, 0, .115, .59, 8)
curve('Wax seal gold rim', [(.16*math.cos(i*math.tau/64), .16*math.sin(i*math.tau/64), .59) for i in range(64)], gold, .008, True)

for name, location, power, color, size in [
    ('Warm window key', (-3, -4, 6), 700, (1, .74, .42), 5),
    ('Violet rim', (3, 2, 4), 1000, (.62, .44, 1), 4),
    ('Soft front fill', (0, -4, 2), 200, (1, .84, .65), 3),
]:
    data = bpy.data.lights.new(name, 'AREA')
    data.energy, data.color, data.size = power, color, size
    o = bpy.data.objects.new(name, data)
    scene.collection.objects.link(o)
    o.location = location
    o.rotation_euler = (Vector((0, 0, .2))-o.location).to_track_quat('-Z', 'Y').to_euler()
bpy.ops.object.camera_add(location=(2.9, -4.8, 4.3))
camera = bpy.context.object
camera.rotation_euler = (Vector((0, 0, .25))-camera.location).to_track_quat('-Z', 'Y').to_euler()
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 3.4
scene.camera = camera
bpy.ops.wm.save_as_mainfile(filepath=str(OUT / 'pentagonal-frog-box.blend'))
for export, visible in [('closed', {'base', 'interior', 'lid', 'seal'}),
                        ('base', {'base', 'interior'}),
                        ('lid', {'lid'}), ('interior', {'interior'}), ('seal', {'seal'})]:
    for key, entries in objects.items():
        for o in entries:
            o.hide_render = key not in visible
    scene.render.filepath = str(OUT / (export + '.png'))
    bpy.ops.render.render(write_still=True)
print('DIAGON_FROG_BOX_COMPLETE', OUT)
